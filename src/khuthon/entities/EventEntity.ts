import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Event')
export class EventEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('int')
  year!: number;

  @Column('int')
  maxTeamCount!: number;

  @Column('int')
  maxMemberCount!: number;

  @Column('datetime')
  registerStartAt!: Date;

  @Column('datetime')
  registerEndAt!: Date;

  @Column('datetime')
  eventStartAt!: Date;

  @Column('datetime')
  eventEndAt!: Date;

  @Column('datetime')
  judgeStartAt!: Date;

  @Column('datetime')
  judgeEndAt!: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  isRegistering(): boolean {
    const now = new Date();
    return this.registerStartAt <= now && now <= this.registerEndAt;
  }

  isEventing(): boolean {
    const now = new Date();
    return this.eventStartAt <= now && now <= this.eventEndAt;
  }

  isJudging(): boolean {
    const now = new Date();
    return this.judgeStartAt <= now && now <= this.judgeEndAt;
  }
}
