import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class EditTeamRequestDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  numbers: string[] | null = null;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string | null = null;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  note: string | null = null;
}
