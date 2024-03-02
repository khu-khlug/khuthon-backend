import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Judge')
export class JudgeEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('varchar', { length: 100 })
  @Index('idx_judge_teamId')
  teamId!: string;

  @Column('varchar', { length: 100 })
  @Index('idx_judge_examinerId')
  examinerId!: string;

  @Column('int')
  creativity!: number; // 독창성

  @Column('int')
  practicality!: number; // 실용도

  @Column('int')
  skill!: number; // 기술력

  @Column('int')
  design!: number; // 디자인

  @Column('int')
  completeness!: number; // 완성도

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
