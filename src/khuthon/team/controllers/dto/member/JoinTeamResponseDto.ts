import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';

export class JoinTeamResponseDto {
  id: string;
  year: number;
  name: string;
  idea: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(teamEntity: TeamEntity) {
    this.id = teamEntity.id;
    this.year = teamEntity.year;
    this.name = teamEntity.name;
    this.idea = teamEntity.idea;
    this.note = teamEntity.note;
    this.createdAt = teamEntity.createdAt;
    this.updatedAt = teamEntity.updatedAt;
  }
}
