import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('Attachment')
export class AttachmentEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 100 })
  teamId!: string;

  @Column('varchar', { length: 100 })
  fileId!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
