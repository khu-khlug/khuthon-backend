import { Injectable } from '@nestjs/common';

@Injectable()
export class KhuthonLogger {
  async log(message: string): Promise<void> {
    // TODO[lery]: 로거 구현 필요, IP/UA 기록
  }
}
