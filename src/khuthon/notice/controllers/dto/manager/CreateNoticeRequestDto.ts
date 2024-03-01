import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoticeRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
