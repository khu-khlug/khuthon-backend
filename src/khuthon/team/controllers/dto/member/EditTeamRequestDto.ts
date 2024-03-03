import { IsOptional, IsString, Length } from 'class-validator';

export class EditTeamRequestDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string | null = null;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  note: string | null = null;
}
