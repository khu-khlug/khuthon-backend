import { MemberState, University } from '@khlug/constant';
import { InvitationEntity } from '@khlug/khuthon/entities/InvitationEntity';
import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';
import { TeamEntity } from '@khlug/khuthon/entities/TeamEntity';

export class GetMyTeamResponseMember {
  id: string;
  email: string;
  university: University;
  state: MemberState;
  studentNumber: string;
  name: string;
  college: string;
  grade: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(memberEntity: MemberEntity) {
    this.id = memberEntity.id;
    this.email = memberEntity.email;
    this.university = memberEntity.university;
    this.state = memberEntity.state;
    this.studentNumber = memberEntity.studentNumber!;
    this.name = memberEntity.name!;
    this.college = memberEntity.college!;
    this.grade = memberEntity.grade!;
    this.phone = memberEntity.phone!;
    this.createdAt = memberEntity.createdAt;
    this.updatedAt = memberEntity.updatedAt;
  }
}

export class GetMyTeamResponseInvitation {
  id: string;
  studentNumber: string;
  university: University;
  createdAt: Date;

  constructor(invitationEntity: InvitationEntity) {
    this.id = invitationEntity.id;
    this.studentNumber = invitationEntity.studentNumber;
    this.university = invitationEntity.university;
    this.createdAt = invitationEntity.createdAt;
  }
}

export class GetMyTeamResponseDto {
  id: string;
  name: string;
  idea: string;
  note: string;
  members: GetMyTeamResponseMember[];
  invitations: GetMyTeamResponseInvitation[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    team: TeamEntity,
    members: MemberEntity[],
    invitations: InvitationEntity[],
  ) {
    this.id = team.id;
    this.name = team.name;
    this.idea = team.idea;
    this.note = team.note;
    this.members = members.map((member) => new GetMyTeamResponseMember(member));
    this.invitations = invitations.map(
      (invitation) => new GetMyTeamResponseInvitation(invitation),
    );
    this.createdAt = team.createdAt;
    this.updatedAt = team.updatedAt;
  }
}
