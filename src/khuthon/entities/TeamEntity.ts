import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TeamState } from '@khlug/constant';

import { MemberEntity } from './MemberEntity';

@Entity('Team')
export class TeamEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 110 })
  name!: string;

  @Column('varchar', { length: 510 })
  idea!: string;

  @Column('varchar', { length: 50 })
  state!: TeamState;

  @Column('varchar', { length: 1010 })
  note!: string;

  @Column('varchar', { length: 110 })
  prize!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => MemberEntity, (member) => member.team, {
    cascade: true,
    eager: true,
  })
  members!: MemberEntity[];
}
