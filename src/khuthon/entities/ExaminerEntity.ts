import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Examiner')
export class ExaminerEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 100 })
  codeSalt!: string;

  @Column('varchar', { length: 100 })
  codeHash!: string;

  @Column('varchar', { length: 100 })
  name!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
