import { Body, Controller, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { MemberUser, UserRole } from '@khlug/khuthon/core/auth/User';
import { AccessTokenBuilder } from '@khlug/khuthon/core/token/AccessTokenBuilder';

import { MemberService } from '../services/MemberService';
import { RegisterMemberRequestDto } from './dto/RegisterMemberRequestDto';
import { RegisterMemberResponseDto } from './dto/RegisterMemberResponseDto';
import { VerifyMemberRequestDto } from './dto/VerifyMemberRequestDto';

@Controller()
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly tokenBuilder: AccessTokenBuilder,
  ) {}

  @Post('/members')
  @Transactional()
  async registerMember(
    @Body() dto: RegisterMemberRequestDto,
  ): Promise<RegisterMemberResponseDto> {
    const { email, password } = dto;

    const member = await this.memberService.register(email, password);
    const token = this.tokenBuilder.buildMemberToken(member.id);

    return new RegisterMemberResponseDto(member, token);
  }

  @Post('/members/verify')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async verifyMember(
    @Requester() requester: MemberUser,
    @Body() dto: VerifyMemberRequestDto,
  ): Promise<void> {
    const { memberId } = requester;
    const { otp } = dto;
    await this.memberService.verify(memberId, otp);
  }
}
