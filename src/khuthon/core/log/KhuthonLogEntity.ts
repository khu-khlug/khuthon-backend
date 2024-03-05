import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('KhuthonLog')
export class KhuthonLogEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 1010 })
  message!: string;

  @Column('varchar', { length: 20 })
  ip!: string | null;

  @Column('varchar', { length: 200 })
  userAgent!: string | null;

  @CreateDateColumn('datetime')
  createdAt!: Date;
}
