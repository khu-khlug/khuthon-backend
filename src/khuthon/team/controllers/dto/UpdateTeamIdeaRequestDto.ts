import { IsString, Length } from 'class-validator';

export class UpdateTeamIdeaRequestDto {
  @IsString()
  @Length(1, 500)
  idea!: string;
}
