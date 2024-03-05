import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import { ClsModule, ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

import { ClsStoreKey } from '@khlug/constant';

import { AuthGuard } from './auth/AuthGuard';
import { configuration } from './config';
import { DatabaseConfig } from './config/DatabaseConfig';
import { EmailSender } from './email/EmailSender';
import { KhuthonLogEntity } from './log/KhuthonLogEntity';
import { KhuthonLogger } from './log/KhuthonLogger';
import { OtpGenerator } from './otp/OtpGenerator';
import { ExaminerCodeGenerator } from './password/ExaminerCodeGenerator';
import { PasswordGenerator } from './password/PasswordGenerator';
import { S3Adapter } from './s3/S3Adapter';
import { SmsSender } from './sms/SmsSender';
import { StuauthAdapter } from './stuauth/StuauthAdapter';
import { AccessTokenBuilder } from './token/AccessTokenBuilder';

const exportableProviders = [
  KhuthonLogger,
  S3Adapter,
  StuauthAdapter,
  SmsSender,
  EmailSender,
  OtpGenerator,
  PasswordGenerator,
  AccessTokenBuilder,
  ExaminerCodeGenerator,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls: ClsService, req: Request) => {
          cls.set(ClsStoreKey.IP, req.ip ?? '');
          cls.set(ClsStoreKey.USER_AGENT, req.headers['user-agent'] ?? '');
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DatabaseConfig>('database');
        if (!config) {
          throw new Error('Database configuration is not found');
        }

        return {
          type: 'mysql',
          host: config.host,
          port: config.port,
          username: config.user,
          password: config.password,
          database: config.database,
        };
      },
      inject: [ConfigService],
      dataSourceFactory: async (option) => {
        if (!option) {
          throw new Error('Database configuration is not found');
        }

        return (
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(option))
        );
      },
    }),
    TypeOrmModule.forFeature([KhuthonLogEntity]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ...exportableProviders,
  ],
  exports: exportableProviders,
})
export class CoreModule {}
