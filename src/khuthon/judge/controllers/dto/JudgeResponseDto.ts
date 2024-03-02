import { JudgeEntity } from '@khlug/khuthon/entities/JudgeEntity';

export class JudgeResponseDto {
  id: string;
  year: number;
  teamId: string;
  examinerId: string;
  creativity: number;
  practicality: number;
  skill: number;
  design: number;
  completeness: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(judge: JudgeEntity) {
    this.id = judge.id;
    this.year = judge.year;
    this.teamId = judge.teamId;
    this.examinerId = judge.examinerId;
    this.creativity = judge.creativity;
    this.practicality = judge.practicality;
    this.skill = judge.skill;
    this.design = judge.design;
    this.completeness = judge.completeness;
    this.createdAt = judge.createdAt;
    this.updatedAt = judge.updatedAt;
  }
}
