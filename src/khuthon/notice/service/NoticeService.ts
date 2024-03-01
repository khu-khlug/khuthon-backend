import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { Message } from '@khlug/constant/message';
import { NoticeEntity } from '@khlug/khuthon/entities/NoticeEntity';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

    private readonly logger: KhuthonLogger,
  ) {}

  async createNotice(title: string, content: string): Promise<NoticeEntity> {
    const newNotice = this.noticeRepository.create({
      id: ulid(),
      title,
      content,
    });
    await this.noticeRepository.save(newNotice);

    await this.logger.log(`관리자가 새로운 공지 사항을 작성했습니다.`);

    return newNotice;
  }

  async updateNotice(
    noticeId: string,
    title: string,
    content: string,
  ): Promise<NoticeEntity> {
    const notice = await this.noticeRepository.findOneBy({ id: noticeId });
    if (!notice) {
      throw new NotFoundException(Message.NOTICE_NOT_FOUND);
    }

    notice.title = title;
    notice.content = content;
    await this.noticeRepository.save(notice);

    await this.logger.log(`관리자가 공지 사항(${noticeId})을 수정했습니다.`);

    return notice;
  }

  async deleteNotice(noticeId: string): Promise<void> {
    const notice = await this.noticeRepository.findOneBy({ id: noticeId });
    if (!notice) {
      throw new NotFoundException(Message.NOTICE_NOT_FOUND);
    }

    await this.noticeRepository.remove(notice);

    await this.logger.log(`관리자가 공지 사항(${noticeId})을 삭제했습니다.`);
  }
}
