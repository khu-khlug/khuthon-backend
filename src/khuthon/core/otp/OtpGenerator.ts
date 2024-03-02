import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@khlug/khuthon/core/config/AppConfig';

@Injectable()
export class OtpGenerator {
  private readonly otpLength: number;

  constructor(private readonly configService: ConfigService) {
    const appConfig = this.configService.get('app') as AppConfig;
    this.otpLength = appConfig.otpLength;
  }

  generate() {
    const candidate = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(
      { length: this.otpLength },
      () => candidate[Math.floor(Math.random() * candidate.length)],
    ).join('');
  }
}
