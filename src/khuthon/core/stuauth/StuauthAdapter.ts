import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

import { Message } from '@khlug/constant/message';
import { StuauthConfig } from '@khlug/khuthon/core/config/StuauthConfig';
import { StuauthResponse } from '@khlug/khuthon/core/stuauth/StuauthResponse';

// !! [주의] !!
// Stuauth는 외부에 API가 직접적으로 노출되지 않아야 합니다.
// 따라서, Stuauth API의 응답이 직접적으로 API의 응답으로 반환되면 안됩니다.
// 즉, Stuauth API에 요청과 응답 모두 백엔드 안에서 처리 후 완료되어야 합니다.
@Injectable()
export class StuauthAdapter {
  private readonly apiUri: string;
  private readonly token: string;
  private readonly consoleLogger: ConsoleLogger;

  constructor(configService: ConfigService) {
    const config = configService.get('stuauth') as StuauthConfig;
    this.apiUri = config.apiUri;
    this.token = config.token;
    this.consoleLogger = new ConsoleLogger(StuauthAdapter.name);
  }

  async getStudentInfo(id: string, pw: string): Promise<StuauthResponse> {
    try {
      const response = await axios.post<StuauthResponse>(this.apiUri, {
        token: this.token,
        id,
        pw,
      });
      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      // 요청 정보에 담긴 인증 정보를 로그에 남기지 않기 위해 try-catch 후 에러 로깅
      this.consoleLogger.error(
        error.response?.data ?? 'Stuauth request failed',
      );

      throw new InternalServerErrorException(Message.STUAUTH_REQUEST_FAILED);
    }
  }
}
