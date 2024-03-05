import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { ExaminerCodeGenerator } from '@khlug/khuthon/core/password/ExaminerCodeGenerator';
import { PasswordGenerator } from '@khlug/khuthon/core/password/PasswordGenerator';
import { AccessTokenBuilder } from '@khlug/khuthon/core/token/AccessTokenBuilder';
import { ExaminerEntity } from '@khlug/khuthon/entities/ExaminerEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(ExaminerEntity)
    private readonly examinerRepository: Repository<ExaminerEntity>,

    private readonly tokenBuilder: AccessTokenBuilder,
    private readonly passwordGenerator: PasswordGenerator,
    private readonly codeGenerator: ExaminerCodeGenerator,
    private readonly logger: KhuthonLogger,
  ) {}

  async loginAsMember(email: string, plainPassword: string): Promise<string> {
    const member = await this.memberRepository.findOneBy({ email });
    if (!member) {
      throw new ForbiddenException(Message.INVALID_CREDENTIALS);
    }

    const password = this.passwordGenerator.generate(
      plainPassword,
      member.passwordSalt,
    );
    if (member.passwordHash !== password.hash) {
      throw new ForbiddenException(Message.INVALID_CREDENTIALS);
    }

    const token = this.tokenBuilder.buildMemberToken(member.id);
    return token;
  }

  async loginAsExaminer(code: string): Promise<string> {
    const year = new Date().getFullYear();
    const codeHash = this.codeGenerator.generate(code);

    const examiner = await this.examinerRepository.findOneBy({ codeHash });
    if (!examiner) {
      throw new ForbiddenException(Message.EXAMINER_NOT_FOUND);
    }

    if (examiner.year !== year) {
      throw new UnprocessableEntityException(Message.INVALID_YEAR);
    }

    const token = this.tokenBuilder.buildExaminerToken(examiner.id);

    await this.logger.log(`${examiner.name}에서 심사위원으로 접속했습니다.`);

    return token;
  }
}
