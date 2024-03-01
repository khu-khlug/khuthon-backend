import { TeamState } from '@khlug/constant';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';

export class RegisterTeamResponseDto {
  id: string;
  year: number;
  name: string;
  idea: string;
  state: TeamState;
  note: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(teamEntity: TeamEntity) {
    this.id = teamEntity.id;
    this.year = teamEntity.year;
    this.name = teamEntity.name;
    this.idea = teamEntity.idea;
    this.state = teamEntity.state;
    this.note = teamEntity.note;
    this.createdAt = teamEntity.createdAt;
    this.updatedAt = teamEntity.updatedAt;
  }
}
