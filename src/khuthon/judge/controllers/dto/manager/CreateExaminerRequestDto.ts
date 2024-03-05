import { IsString, Length } from 'class-validator';

export class CreateExaminerRequestDto {
  @IsString()
  @Length(1, 100)
  code!: string;

  @IsString()
  @Length(1, 100)
  name!: string;
}
