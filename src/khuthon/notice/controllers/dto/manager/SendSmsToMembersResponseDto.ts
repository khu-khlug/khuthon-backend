export class SendSmsToMembersResponseDto {
  successCount: number;
  failCount: number;

  constructor(successCount: number, failCount: number) {
    this.successCount = successCount;
    this.failCount = failCount;
  }
}
