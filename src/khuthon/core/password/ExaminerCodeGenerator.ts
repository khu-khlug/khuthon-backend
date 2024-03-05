import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

import { AppConfig } from '../config/AppConfig';

@Injectable()
export class ExaminerCodeGenerator {
  private readonly salt: string;

  constructor(configService: ConfigService) {
    const appConfig = configService.get('app') as AppConfig;
    this.salt = appConfig.examinerSalt;
  }

  generate(code: string): string {
    const hash = createHash('sha256')
      .update(`${this.salt}:${code}`)
      .digest('hex');
    return hash;
  }
}
