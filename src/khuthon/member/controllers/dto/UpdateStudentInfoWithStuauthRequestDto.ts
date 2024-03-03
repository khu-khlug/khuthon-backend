import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentInfoWithStuauthRequestDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
