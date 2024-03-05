import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class PointDto {
  @IsInt()
  @Min(0)
  @Max(10)
  creativity!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  practicality!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  skill!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  design!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  completeness!: number;
}

export class JudgeRequestDto {
  @IsString()
  @IsNotEmpty()
  teamId!: string;

  @Type(() => PointDto)
  @ValidateNested()
  points!: PointDto;
}
