import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('File')
export class FileEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 100, nullable: true })
  teamId!: string | null;

  @Column('varchar', { length: 200 })
  fileName!: string;

  @Column('varchar', { length: 200 })
  fileKey!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
