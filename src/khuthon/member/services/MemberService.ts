import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { MemberState, University } from '@khlug/constant';
import { Message } from '@khlug/constant/message';
import { PasswordGenerator } from '@khlug/khuthon/common/PasswordGenerator';
import { EmailSender } from '@khlug/khuthon/core/email/EmailSender';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { OtpGenerator } from '@khlug/khuthon/core/otp/OtpGenerator';
import { StuauthAdapter } from '@khlug/khuthon/core/stuauth/StuauthAdapter';
import { EmailVerificationEntity } from '@khlug/khuthon/entities/EmailVerificationEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

const _5_MINUTES = 5 * 60 * 1000;

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(EmailVerificationEntity)
    private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,

    private readonly emailSender: EmailSender,
    private readonly logger: KhuthonLogger,
    private readonly passwordGenerator: PasswordGenerator,
    private readonly otpGenerator: OtpGenerator,
    private readonly stuauthAdapter: StuauthAdapter,
  ) {}

  async register(email: string, plainPassword: string): Promise<MemberEntity> {
    const year = new Date().getFullYear();

    const prevMember = await this.memberRepository.findOneBy({ year, email });
    if (prevMember) {
      throw new UnprocessableEntityException(Message.ALREADY_REGISTERED_MEMBER);
    }

    const password = this.passwordGenerator.generate(plainPassword);

    const newMember = this.memberRepository.create({
      id: ulid(),
      year,
      email,
      passwordHash: password.hash,
      passwordSalt: password.salt,
      state: MemberState.NEED_VERIFICATION,
    });
    await this.memberRepository.save(newMember);

    const newOtp = this.otpGenerator.generate();
    const newEmailVerification = this.emailVerificationRepository.create({
      id: ulid(),
      memberId: newMember.id,
      otp: newOtp,
      expiredAt: new Date(Date.now() + _5_MINUTES),
    });
    await this.emailVerificationRepository.save(newEmailVerification);

    await this.logger.log(
      `'${email}'로 등록 시도가 발생하여 이메일 인증을 시작합니다.`,
    );

    // TODO[lery]: OTP 이메일 템플릿 시간 되면 구현하기
    await this.emailSender.send(
      email,
      '[khuthon] 대회 참가를 위해 이메일을 인증해주세요.',
      `인증번호: ${newOtp}`,
    );

    return newMember;
  }

  async verify(memberId: string, otp: string): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.state !== MemberState.NEED_VERIFICATION) {
      throw new UnprocessableEntityException(Message.CANNOT_VERIFY_NOW);
    }

    const emailVerifications = await this.emailVerificationRepository.findBy({
      memberId,
    });
    if (emailVerifications.length === 0) {
      throw new UnprocessableEntityException(Message.INVALID_OTP);
    }

    const latestVerification = emailVerifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];

    if (latestVerification.expiredAt < new Date()) {
      throw new UnprocessableEntityException(Message.INVALID_OTP);
    }

    if (otp !== latestVerification.otp) {
      throw new UnprocessableEntityException(Message.INVALID_OTP);
    }

    member.state = MemberState.NEED_STUDENT_INFO;

    await this.memberRepository.save(member);
    await this.emailVerificationRepository.delete({ memberId });

    await this.logger.log(`'${member.email}'의 이메일 인증이 완료되었습니다.`);
  }

  async updateStudentInfo(
    memberId: string,
    studentInfo: {
      studentNumber: string;
      name: string;
      college: string;
      grade: number;
      phone: string | null;
    },
  ): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.university === University.KYUNGHEE_UNIV) {
      throw new UnprocessableEntityException(Message.USE_STUAUTH);
    }

    if (member.state !== MemberState.NEED_STUDENT_INFO) {
      throw new UnprocessableEntityException(
        Message.CANNOT_UPDATE_STUDENT_INFO_NOW,
      );
    }

    member.studentNumber = studentInfo.studentNumber;
    member.name = studentInfo.name;
    member.college = studentInfo.college;
    member.grade = studentInfo.grade;
    member.phone = studentInfo.phone;
    member.state = MemberState.NEED_TEAM;

    await this.memberRepository.save(member);
    await this.logger.log(
      `'${member.email}'의 학적 정보가 업데이트 되었습니다.`,
    );
  }

  async updateStudentInfoWithStuauth(
    memberId: string,
    info21Id: string,
    info21Password: string,
  ): Promise<void> {
    const member = await this.memberRepository.findOneBy({ id: memberId });
    if (!member) {
      throw new UnprocessableEntityException(Message.MEMBER_NOT_FOUND);
    }

    if (member.university !== University.KYUNGHEE_UNIV) {
      throw new UnprocessableEntityException(Message.CANNOT_USE_STUAUTH);
    }

    if (member.state !== MemberState.NEED_STUDENT_INFO) {
      throw new UnprocessableEntityException(
        Message.CANNOT_UPDATE_STUDENT_INFO_NOW,
      );
    }

    const stuauthResponse = await this.stuauthAdapter.getStudentInfo(
      info21Id,
      info21Password,
    );

    // code가 100이 아니면 정상 응답이 아님
    if (stuauthResponse.code !== 100) {
      throw new UnprocessableEntityException(
        decodeURIComponent(stuauthResponse.message),
      );
    }

    const studentInfo = stuauthResponse.data;
    const majorString = studentInfo.major
      .map((major) =>
        [major.college, major.department, major.major]
          .filter((v) => !!v)
          .join(' '),
      )
      .join(', ');

    member.studentNumber = studentInfo.id.toString();
    member.name = studentInfo.name;
    member.college = majorString;
    member.grade = studentInfo.grade;
    member.phone = studentInfo.phone;
    member.state = MemberState.NEED_TEAM;

    await this.memberRepository.save(member);
    await this.logger.log(
      `'${member.email}'의 학적 정보가 Stuauth로 업데이트 되었습니다.`,
    );
  }
}
