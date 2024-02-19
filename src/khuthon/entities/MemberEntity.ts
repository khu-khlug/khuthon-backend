import { MemberState } from '@khlug/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Member')
export class MemberEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 100 })
  teamId!: string;

  @Column('int', { name: 'number' })
  studentNumber!: number;

  @Column('varchar', { length: 50 })
  name!: string;

  @Column('varchar', { length: 60 })
  university!: string;

  @Column('varchar', { length: 160 })
  college!: string;

  @Column('int')
  grade!: number;

  @Column('varchar', { length: 20 })
  phone!: string;

  @Column('varchar', { length: 50 })
  email!: string;

  @Column('varchar', { length: 30 })
  state!: MemberState;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
