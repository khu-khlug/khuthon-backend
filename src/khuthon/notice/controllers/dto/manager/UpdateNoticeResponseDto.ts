import { NoticeEntity } from '@khlug/khuthon/entities/NoticeEntity';

export class UpdateNoticeResponseDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(notice: NoticeEntity) {
    this.id = notice.id;
    this.title = notice.title;
    this.content = notice.content;
    this.createdAt = notice.createdAt;
    this.updatedAt = notice.updatedAt;
  }
}
