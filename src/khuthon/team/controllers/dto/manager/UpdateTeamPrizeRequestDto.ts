import { IsString, Length } from 'class-validator';

export class UpdateTeamPrizeRequestDto {
  @IsString()
  @Length(1, 100)
  prize!: string;
}
