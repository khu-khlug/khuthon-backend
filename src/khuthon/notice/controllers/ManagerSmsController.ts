import { Body, Controller, Post } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { Roles } from '@khlug/khuthon/core/auth/Roles';
import { UserRole } from '@khlug/khuthon/core/auth/User';

import { SmsService } from '../service/SmsService';
import { SendSmsToMembersRequestDto } from './dto/manager/SendSmsToMembersRequestDto';
import { SendSmsToMembersResponseDto } from './dto/manager/SendSmsToMembersResponseDto';

@Controller()
export class ManagerSmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/manager/send-sms')
  @Roles([UserRole.MANAGER])
  @Transactional()
  async sendSmsToMembers(
    @Body() dto: SendSmsToMembersRequestDto,
  ): Promise<SendSmsToMembersResponseDto> {
    const { memberIds, message } = dto;

    const result = await this.smsService.sendSmsTo(memberIds, message);

    return new SendSmsToMembersResponseDto(
      result.successCount,
      result.failCount,
    );
  }
}
