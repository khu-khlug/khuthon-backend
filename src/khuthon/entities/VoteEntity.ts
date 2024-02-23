import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/**
 * sourceTeamId: team1, destTeamId: team2라고 하면,
 * team1 팀이 team2를 투표한 것입니다.
 */
@Entity('Vote')
export class VoteEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 100 })
  sourceTeamId!: string;

  @Column('varchar', { length: 100 })
  destTeamId!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
