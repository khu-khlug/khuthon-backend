import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

import { Message } from '@khlug/constant/message';

import { StuauthConfig } from '../config/StuauthConfig';
import { StuauthResponse } from './StuauthResponse';

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
