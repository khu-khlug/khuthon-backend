import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('File')
export class FileEntity {
  @PrimaryColumn('string', { length: 100 })
  id!: string;

  @Column('string', { length: 100, nullable: true })
  teamId!: string | null;

  @Column('string', { length: 200 })
  fileName!: string;

  @Column('string', { length: 200 })
  fileKey!: string;

  @CreateDateColumn('datetime')
  createdAt!: Date;
}
