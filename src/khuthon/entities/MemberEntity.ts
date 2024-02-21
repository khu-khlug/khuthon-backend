import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MemberState, University } from '@khlug/constant';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';

@Entity('Member')
export class MemberEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 100 })
  teamId!: string;

  @Column('varchar', { length: 15 })
  studentNumber!: string;

  @Column('varchar', { length: 50, nullable: true })
  name!: string | null;

  @Column('varchar', { length: 60, nullable: true })
  university!: University | null;

  @Column('varchar', { length: 160, nullable: true })
  college!: string | null;

  @Column('int', { nullable: true })
  grade!: number | null;

  @Column('varchar', { length: 20, nullable: true })
  phone!: string | null;

  @Column('varchar', { length: 50, nullable: true })
  email!: string | null;

  @Column('varchar', { length: 30 })
  state!: MemberState;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @ManyToOne(() => TeamEntity, (team) => team.members, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  team!: TeamEntity;
}
