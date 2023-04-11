import { Injectable, Inject } from '@nestjs/common';
import 'dotenv/config';
import * as crypto from 'crypto';
import { DATABASE_CONNECTION } from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
@Injectable()
export class PasswordService {
  constructor(@Inject(DATABASE_CONNECTION) private DB: Sequelize) {}
  private readonly secret = process.env.AUTH_MODULE;

  encryptPassword(password: string, MSISDN: string): string {
    const hash = crypto
      .createHmac('sha256', this.secret)
      .update(password)
      .digest('hex');
    const walletinfo = JSON.parse(
      JSON.stringify(
        this.DB.query(
          `Exec dbo.WalletPinDetail @Msisdn = ${MSISDN}, @Flag = 'UpdateWalletPin',@New_Pin = '${hash}' `,
        ),
      ),
    );
    console.log(walletinfo);

    return hash;
  }

  verifyPassword(
    password: string,
    hashedPassword: string,
    MSISDN: string,
  ): boolean {
    const hash = crypto
      .createHmac('sha256', this.secret)
      .update(password)
      .digest('hex');
    const result = hash === hashedPassword;
    if (result === false) {
      const walletinfo = JSON.parse(
        JSON.stringify(
          this.DB.query(
            `Exec dbo.WalletPinDetail @Msisdn = ${MSISDN}, @Flag = 'FailedWalletPin'`,
          ),
        ),
      );
      console.log(walletinfo);
    }

    return result;
  }
}
