import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class UpdateStudentInfoRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  studentNumber!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 40)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  college!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  grade!: number;

  @IsOptional()
  @IsString()
  @Matches(/^010-[0-9]{4}-[0-9]{4}$/)
  @Length(1, 20)
  phone: string | null = null;
}
