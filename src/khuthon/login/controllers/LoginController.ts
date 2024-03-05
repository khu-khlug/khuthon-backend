import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { LoginService } from '../services/LoginService';
import { LoginRequestDto } from './dto/member/LoginRequestDto';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: LoginRequestDto) {
    const { email, password } = dto;

    const token = await this.loginService.loginAsMember(email, password);

    return { token };
  }
}
