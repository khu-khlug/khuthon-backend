import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

import { PasswordGenerator } from '../common/PasswordGenerator';
import { AuthGuard } from './auth/AuthGuard';
import { configuration } from './config';
import { DatabaseConfig } from './config/DatabaseConfig';
import { EmailSender } from './email/EmailSender';
import { KhuthonLogger } from './log/KhuthonLogger';
import { OtpGenerator } from './otp/OtpGenerator';
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
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
