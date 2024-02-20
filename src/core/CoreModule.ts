import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { configuration } from './config';
import { DatabaseConfig } from './config/DatabaseConfig';
import { SmsSender } from './sms/SmsSender';

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

        return addTransactionalDataSource(new DataSource(option));
      },
    }),
  ],
  providers: [SmsSender],
  exports: [SmsSender],
})
export class CoreModule {}
