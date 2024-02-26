import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

export interface IPassword {
  salt: string;
  hash: string;
}

@Injectable()
export class PasswordGenerator {
  generate(password: string, givenSalt?: string): IPassword {
    const salt = givenSalt ?? randomBytes(32).toString('hex');
    const hash = createHash('sha256')
      .update(`${password}/${salt}`)
      .digest('hex');
    return { salt, hash };
  }
}
