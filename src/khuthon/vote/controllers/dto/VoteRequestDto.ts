import { ArrayMaxSize, ArrayMinSize, IsString } from 'class-validator';

export class VoteRequestDto {
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  destTeamIds!: string[];
}
