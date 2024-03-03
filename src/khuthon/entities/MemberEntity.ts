import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MemberState, University } from '@khlug/constant';

@Entity('Member')
export class MemberEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 50 })
  @Index('idx_member_email')
  email!: string;

  @Column('varchar', { length: 100 })
  passwordHash!: string;

  @Column('varchar', { length: 100 })
  passwordSalt!: string;

  @Column('varchar', { length: 60 })
  university!: University;

  @Column('varchar', { length: 30 })
  state!: MemberState;

  @Column('varchar', { length: 100, nullable: true })
  @Index('idx_member_teamId')
  teamId!: string | null;

  @Column('varchar', { length: 15, nullable: true })
  studentNumber!: string | null;

  @Column('varchar', { length: 50, nullable: true })
  name!: string | null;

  @Column('varchar', { length: 1010, nullable: true })
  college!: string | null;

  @Column('int', { nullable: true })
  grade!: number | null;

  @Column('varchar', { length: 20, nullable: true })
  phone!: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
