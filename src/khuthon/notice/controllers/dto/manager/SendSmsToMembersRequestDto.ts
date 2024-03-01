import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';

export class SendSmsToMembersRequestDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  memberIds!: string[];
}
