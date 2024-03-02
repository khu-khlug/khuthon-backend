import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class PasswordGenerator {
  generate(plain: string, givenSalt?: string): Password {
    const salt = givenSalt ?? randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(`${salt}:${plain}`).digest('hex');
    return { hash, salt };
  }
}
