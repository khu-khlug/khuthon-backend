import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Requester } from '@khlug/khuthon/core/auth/Requester';
import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { MemberUser, UserRole } from '@khlug/khuthon/core/auth/User';
import { AccessTokenBuilder } from '@khlug/khuthon/core/token/AccessTokenBuilder';
import { RegisterMemberRequestDto } from '@khlug/khuthon/member/controllers/dto/RegisterMemberRequestDto';
import { RegisterMemberResponseDto } from '@khlug/khuthon/member/controllers/dto/RegisterMemberResponseDto';
import { UpdateStudentInfoRequestDto } from '@khlug/khuthon/member/controllers/dto/UpdateStudentInfoRequestDto';
import { UpdateStudentInfoWithStuauthRequestDto } from '@khlug/khuthon/member/controllers/dto/UpdateStudentInfoWithStuauthRequestDto';
import { VerifyMemberRequestDto } from '@khlug/khuthon/member/controllers/dto/VerifyMemberRequestDto';
import { MemberService } from '@khlug/khuthon/member/services/MemberService';
import { NoBodyLog } from '@khlug/logging/NoBodyLog';

import { GetMemberResponseDto } from './dto/GetMemberResponseDto';

@Controller()
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly tokenBuilder: AccessTokenBuilder,
  ) {}

  @Get('/member')
  @Roles([UserRole.MEMBER])
  async getMember(
    @Requester() requester: MemberUser,
  ): Promise<GetMemberResponseDto> {
    const { memberId } = requester;
    const member = await this.memberService.getMember(memberId);
    return GetMemberResponseDto.buildFromEntity(member);
  }

  @Post('/members')
  @NoBodyLog()
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

  @Put('/members/student-info')
  @Roles([UserRole.MEMBER])
  @Transactional()
  async updateStudentInfo(
    @Requester() requester: MemberUser,
    @Body() dto: UpdateStudentInfoRequestDto,
  ): Promise<void> {
    const { memberId } = requester;
    const { studentNumber, name, college, grade, phone } = dto;

    await this.memberService.updateStudentInfo(memberId, {
      studentNumber,
      name,
      college,
      grade,
      phone,
    });
  }

  @Put('/members/student-info/stuauth')
  @NoBodyLog()
  @Roles([UserRole.MEMBER])
  @Transactional()
  async updateStudentInfoWithStuauth(
    @Requester() requester: MemberUser,
    @Body() dto: UpdateStudentInfoWithStuauthRequestDto,
  ): Promise<void> {
    const { memberId } = requester;
    const { id, password } = dto;

    await this.memberService.updateStudentInfoWithStuauth(
      memberId,
      id,
      password,
    );
  }
}
