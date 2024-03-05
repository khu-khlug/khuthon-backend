import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '@khlug/constant/message';
import { PasswordGenerator } from '@khlug/khuthon/common/PasswordGenerator';
import { AccessTokenBuilder } from '@khlug/khuthon/core/token/AccessTokenBuilder';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,

    private readonly tokenBuilder: AccessTokenBuilder,
    private readonly passwordGenerator: PasswordGenerator,
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
}
