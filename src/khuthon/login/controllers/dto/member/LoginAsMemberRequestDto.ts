import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAsMemberRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
