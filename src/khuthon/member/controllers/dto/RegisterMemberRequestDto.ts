import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { EmailDomain } from '@khlug/constant';

export class RegisterMemberRequestDto {
  @IsEmail()
  @Matches(new RegExp(`(${Object.values(EmailDomain).join('|')})$`))
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  password!: string;
}
