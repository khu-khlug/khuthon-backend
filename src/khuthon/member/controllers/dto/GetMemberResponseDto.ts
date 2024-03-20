import { MemberState, University } from '@khlug/constant';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

export class GetMemberResponseDto {
  readonly id: string;
  readonly email: string;
  readonly university: University;
  readonly state: MemberState;
  readonly teamId: string | null;
  readonly studentNumber: string | null;
  readonly name: string | null;
  readonly college: string | null;
  readonly grade: number | null;
  readonly phone: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    university: University,
    state: MemberState,
    teamId: string | null,
    studentNumber: string | null,
    name: string | null,
    college: string | null,
    grade: number | null,
    phone: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.university = university;
    this.state = state;
    this.teamId = teamId;
    this.studentNumber = studentNumber;
    this.name = name;
    this.college = college;
    this.grade = grade;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static buildFromEntity(entity: MemberEntity): GetMemberResponseDto {
    return new GetMemberResponseDto(
      entity.id,
      entity.email,
      entity.university,
      entity.state,
      entity.teamId,
      entity.studentNumber,
      entity.name,
      entity.college,
      entity.grade,
      entity.phone,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
