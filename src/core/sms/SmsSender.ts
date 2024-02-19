import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsSender {
  constructor() {}

  async send(phone: string, message: string): Promise<void> {
    // TODO[lery]: 메시지 전송 구현 필요
  }
}
