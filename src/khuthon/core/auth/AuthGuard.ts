import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { Message } from '@khlug/constant/message';

import { AppConfig } from '../config/AppConfig';
import { ROLES_DECORATOR_KEY } from './Roles';
import { User, UserRole } from './User';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const roles: UserRole[] = Reflect.getMetadata(ROLES_DECORATOR_KEY, handler);

    // 지정된 역할이 없으면 무조건 통과
    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (authorization) {
      const user = this.translateTokenToPayload(authorization);

      if (!roles.includes(user.role)) {
        throw new ForbiddenException(Message.FORBIDDEN_RESOURCE);
      }

      request['user'] = user;
    } else {
      throw new UnauthorizedException(Message.TOKEN_REQUIRED);
    }

    return true;
  }

  private translateTokenToPayload(authorization: string): User {
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(Message.TOKEN_REQUIRED);
    }

    try {
      const appConfig = this.configService.get<AppConfig>('app');
      return jwt.verify(token, appConfig!.jwtSecret) as User;
    } catch (error) {
      throw new UnauthorizedException(Message.TOKEN_REQUIRED);
    }
  }
}
