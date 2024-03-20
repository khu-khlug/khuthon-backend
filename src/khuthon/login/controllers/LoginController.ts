import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { NoBodyLog } from '@khlug/logging/NoBodyLog';

import { LoginService } from '../services/LoginService';
import { LoginAsExaminerRequestDto } from './dto/examiner/LoginAsExaminerRequestDto';
import { LoginAsExaminerResponseDto } from './dto/examiner/LoginAsExaminerResponseDto';
import { LoginAsMemberRequestDto } from './dto/member/LoginAsMemberRequestDto';
import { LoginAsMemberResponseDto } from './dto/member/LoginAsMemberResponseDto';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/member/login')
  @NoBodyLog()
  @HttpCode(200)
  async loginAsMember(
    @Body() dto: LoginAsMemberRequestDto,
  ): Promise<LoginAsMemberResponseDto> {
    const { email, password } = dto;

    const token = await this.loginService.loginAsMember(email, password);

    return new LoginAsMemberResponseDto(token);
  }

  @Post('/examiner/login')
  @HttpCode(200)
  async loginAsExaminer(
    @Body() dto: LoginAsExaminerRequestDto,
  ): Promise<LoginAsExaminerResponseDto> {
    const { code } = dto;

    const token = await this.loginService.loginAsExaminer(code);

    return new LoginAsExaminerResponseDto(token);
  }
}
