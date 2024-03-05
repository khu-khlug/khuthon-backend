export class LoginAsMemberResponseDto {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
