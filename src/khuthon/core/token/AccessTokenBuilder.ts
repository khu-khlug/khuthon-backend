import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { ExaminerUser, MemberUser, UserRole } from '../auth/User';
import { AppConfig } from '../config/AppConfig';

@Injectable()
export class AccessTokenBuilder {
  private readonly jwtSecret: string;

  constructor(configService: ConfigService) {
    const appConfig = configService.get('app') as AppConfig;
    this.jwtSecret = appConfig.jwtSecret;
  }

  buildMemberToken(memberId: string): string {
    const payload: MemberUser = {
      role: UserRole.MEMBER,
      memberId,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }

  buildExaminerToken(examinerId: string): string {
    const payload: ExaminerUser = {
      role: UserRole.EXAMINER,
      examinerId,
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
  }
}
