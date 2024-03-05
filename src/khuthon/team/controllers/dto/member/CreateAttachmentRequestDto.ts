import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttachmentRequestDto {
  @IsString()
  @IsNotEmpty()
  fileId!: string;
}
