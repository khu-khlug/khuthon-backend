import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { SmsSender } from '@khlug/khuthon/core/sms/SmsSender';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,

    private readonly smsSender: SmsSender,
    private readonly logger: KhuthonLogger,
  ) {}

  async sendSmsTo(
    memberIds: string[],
    message: string,
  ): Promise<{ successCount: number; failCount: number }> {
    const uniqueMemberIds = Array.from(new Set(memberIds));

    // 중복된 대상이 있는지 확인
    if (uniqueMemberIds.length !== memberIds.length) {
      throw new UnprocessableEntityException(Message.INVALID_SMS_TARGET_MEMBER);
    }

    const members = await this.memberRepository.find({
      where: { id: In(uniqueMemberIds) },
    });

    // 존재하지 않는 멤버가 있는지 확인
    if (members.length !== uniqueMemberIds.length) {
      throw new UnprocessableEntityException(Message.INVALID_SMS_TARGET_MEMBER);
    }

    const successMembers: MemberEntity[] = [];
    const failMembers: MemberEntity[] = members.filter(
      (member) => !member.phone,
    );

    // 일단 동기적으로 반복하게 구현
    // 속도가 너무 안 나면 p-throttle 혹은 p-limit 등으로 동시성 제한 걸어서 보내기
    for (const member of members) {
      if (!member.phone) {
        continue;
      }

      try {
        await this.smsSender.send(member.phone, message);
        successMembers.push(member);
      } catch (error) {
        failMembers.push(member);
        console.error(
          `${member.name}(${member.id}, ${member.phone}) 참가자에게 메시지를 보내는 중에 문제가 발생했습니다.`,
          error,
        );
      }
    }

    const successNames = successMembers.map((member) => member.name).join(', ');

    await this.logger.log(
      `관리자가 ${successNames} 참가자에게 문자 메시지를 발송하였습니다. 내용: ${message}`,
    );

    return {
      successCount: successMembers.length,
      failCount: failMembers.length,
    };
  }
}
