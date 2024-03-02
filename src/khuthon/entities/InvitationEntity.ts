import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

import { University } from '@khlug/constant';

@Entity('Invitation')
export class InvitationEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 100 })
  teamId!: string;

  @Column('varchar', { length: 15 })
  studentNumber!: string;

  @Column('varchar', { length: 60 })
  university!: University;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
