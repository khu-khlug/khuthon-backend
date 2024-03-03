import { IsString, Length } from 'class-validator';

export class RegisterTeamRequestDto {
  @IsString()
  @Length(1, 100)
  teamName!: string;
}
