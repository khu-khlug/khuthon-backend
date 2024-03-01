import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoticeRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
