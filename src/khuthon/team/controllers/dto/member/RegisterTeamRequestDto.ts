import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { University } from '@khlug/constant';

export class RegisterTeamRequestTeam {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(0, 1000)
  note: string = '';
}

export class RegisterTeamRequestMember {
  @IsNumberString()
  @Length(1, 12)
  studentNumber!: string;

  @IsString()
  @Length(1, 40)
  name!: string;

  @IsEnum(University)
  university!: University;

  @IsString()
  @Length(1, 150)
  college!: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  grade!: number;

  // 실제 표준 전화번호는 더 복잡하지만, 불필요하다 판단함.
  @Matches(/^010-[0-9]{4}-[0-9]{4}$/)
  phone!: string;

  @IsEmail()
  email!: string;
}

export class RegisterTeamRequestDto {
  @Type(() => RegisterTeamRequestTeam)
  @ValidateNested()
  team!: RegisterTeamRequestTeam;

  @Type(() => RegisterTeamRequestMember)
  @ValidateNested()
  member!: RegisterTeamRequestMember;
}
