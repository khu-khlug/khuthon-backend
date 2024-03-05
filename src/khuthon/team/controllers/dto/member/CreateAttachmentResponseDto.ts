import { AttachmentEntity } from '@khlug/khuthon/entities/AttachmentEntity';

export class CreateAttachmentResponseDto {
  id: string;

  constructor(attachment: AttachmentEntity) {
    this.id = attachment.id;
  }
}
