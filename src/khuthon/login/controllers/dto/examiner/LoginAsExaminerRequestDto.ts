import { IsString, Length } from 'class-validator';

export class LoginAsExaminerRequestDto {
  @IsString()
  @Length(1, 100)
  code!: string;
}
