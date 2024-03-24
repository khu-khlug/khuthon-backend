import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

import { Message } from '@khlug/constant/message';
import { KhuthonLogger } from '@khlug/khuthon/core/log/KhuthonLogger';
import { S3Adapter } from '@khlug/khuthon/core/s3/S3Adapter';
import { NoticeEntity } from '@khlug/khuthon/entities/NoticeEntity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

    private readonly logger: KhuthonLogger,
    private readonly s3Adapter: S3Adapter,
  ) {}

  async createNotice(title: string, content: string): Promise<NoticeEntity> {
    const newNotice = this.noticeRepository.create({
      id: ulid(),
      title,
      content,
    });
    await this.noticeRepository.save(newNotice);

    await this.logger.log(`관리자가 새로운 공지 사항을 작성했습니다.`);
    await this.replicateNoticeToS3(newNotice);
    await this.replicateNoticeListToS3();

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
    await this.replicateNoticeToS3(notice);
    await this.replicateNoticeListToS3();

    return notice;
  }

  async deleteNotice(noticeId: string): Promise<void> {
    const notice = await this.noticeRepository.findOneBy({ id: noticeId });
    if (!notice) {
      throw new NotFoundException(Message.NOTICE_NOT_FOUND);
    }

    await this.noticeRepository.remove(notice);

    await this.logger.log(`관리자가 공지 사항(${noticeId})을 삭제했습니다.`);
    await this.deleteNoticeReplicaFromS3(noticeId);
    await this.replicateNoticeListToS3();
  }

  private async replicateNoticeToS3(notice: NoticeEntity): Promise<void> {
    const noticeBuffer = Buffer.from(JSON.stringify(notice), 'utf8');

    const fileKey = `notices/${notice.id}.json`;
    await this.s3Adapter.uploadObject(fileKey, noticeBuffer);
  }

  private async deleteNoticeReplicaFromS3(noticeId: string): Promise<void> {
    const fileKey = `notices/${noticeId}.json`;
    await this.s3Adapter.deleteObject(fileKey);
  }

  private async replicateNoticeListToS3(): Promise<void> {
    const notices = await this.noticeRepository
      .createQueryBuilder()
      .select(['id', 'title', 'createdAt'])
      .orderBy('createdAt', 'DESC')
      .getRawMany();
    const noticeList = JSON.stringify(notices);
    console.log(noticeList);
    const noticeListBuffer = Buffer.from(noticeList, 'utf8');

    const fileKey = 'notice.json';
    await this.s3Adapter.uploadObject(fileKey, noticeListBuffer);
  }
}
