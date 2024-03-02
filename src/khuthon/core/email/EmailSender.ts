import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as SendgridClient } from '@sendgrid/client';
import * as sendgrid from '@sendgrid/mail';

import { SendgridConfig } from '../config/SendgridConfig';

@Injectable()
export class EmailSender {
  constructor(configService: ConfigService) {
    const config = configService.get('sendgrid') as SendgridConfig;

    const client = new SendgridClient();
    client.setDefaultRequest('baseUrl', config.baseUrl);

    sendgrid.setClient(client);
    sendgrid.setApiKey(config.apiKey);
  }

  // TODO[lery]: 이후 템플릿 적용하여 메일 보내기
  async sendEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<sendgrid.ClientResponse> {
    const [response] = await sendgrid.send({
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
        },
      ],
      from: {
        email: 'we_are@khlug.org',
        name: '쿠러그',
      },
      subject,
      content: [
        {
          type: 'text/plain',
          value: text,
        },
      ],
    });
    return response;
  }
}
