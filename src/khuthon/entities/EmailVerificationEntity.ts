import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity('EmailVerification')
export class EmailVerificationEntity {
  @PrimaryColumn('varchar', { length: 100 })
  id!: string;

  @Column('varchar', { length: 100 })
  @Index('idx_emailVerification_memberId')
  memberId!: string;

  // 얘도 해싱 처리하면 좋긴 한데 과한 거 같아서 패스함.
  // 필요 시 구현.
  @Column('varchar', { length: 10 })
  otp!: string;

  @Column('datetime')
  expiredAt!: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
