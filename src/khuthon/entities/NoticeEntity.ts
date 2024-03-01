import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class NoticeEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 210 })
  title!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
