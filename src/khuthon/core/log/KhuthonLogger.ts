import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { ClsStoreKey } from '@khlug/constant';
import { KhuthonLogEntity } from '@khlug/khuthon/core/log/KhuthonLogEntity';

@Injectable()
export class KhuthonLogger {
  constructor(
    @InjectRepository(KhuthonLogEntity)
    private readonly logRepository: Repository<KhuthonLogEntity>,
    private readonly clsService: ClsService,
  ) {}

  async log(message: string): Promise<void> {
    const ip = this.clsService.get<string>(ClsStoreKey.IP);
    const userAgent = this.clsService.get<string>(ClsStoreKey.USER_AGENT);

    const newLog = this.logRepository.create({
      id: ulid(),
      message,
      ip,
      userAgent,
    });
    await this.logRepository.save(newLog);
  }
}
