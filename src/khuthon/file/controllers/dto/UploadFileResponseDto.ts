import { FileEntity } from '@khlug/khuthon/entities/FileEntity';

export class UploadFileResponseDto {
  id: string;
  fileKey: string;

  constructor(file: FileEntity) {
    this.id = file.id;
    this.fileKey = file.fileKey;
  }
}
