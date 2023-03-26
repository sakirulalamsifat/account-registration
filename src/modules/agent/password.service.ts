import { Injectable } from '@nestjs/common';
import 'dotenv/config';
@Injectable()
export class PasswordService {
  private readonly secret = process.env.AUTH_MODULE;

  encryptPassword(password: string): string {
    const hash = crypto
      .createHmac('sha256', this.secret)
      .update(password)
      .digest('hex');
    return hash;
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    const hash = crypto
      .createHmac('sha256', this.secret)
      .update(password)
      .digest('hex');
    return hash === hashedPassword;
  }
}
