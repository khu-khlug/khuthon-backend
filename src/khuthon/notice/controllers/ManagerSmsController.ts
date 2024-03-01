import { Body, Controller, Post } from '@nestjs/common';

import { SmsService } from '../service/SmsService';
import { SendSmsToMembersRequestDto } from './dto/manager/SendSmsToMembersRequestDto';
import { SendSmsToMembersResponseDto } from './dto/manager/SendSmsToMembersResponseDto';

@Controller()
export class ManagerSmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('/send-sms')
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
