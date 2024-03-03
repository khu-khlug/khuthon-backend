import { IsNotEmpty, IsString, Length } from 'class-validator';

export class InviteTeamMemberRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  studentNumber!: string;
}
