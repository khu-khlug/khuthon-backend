import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  otp!: string;
}
