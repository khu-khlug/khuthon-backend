import { MemberEntity } from '@khlug/khuthon/entities/MemberEntity';

export class RegisterMemberResponseDto {
  id: string;
  token: string;

  constructor(member: MemberEntity, token: string) {
    this.id = member.id;
    this.token = token;
  }
}
