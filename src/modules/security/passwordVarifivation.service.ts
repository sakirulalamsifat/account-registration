import { Injectable, Inject } from '@nestjs/common';
import 'dotenv/config';
import * as crypto from 'crypto';
import { DATABASE_CONNECTION } from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { winstonLog } from '../../config/winstonLog';
@Injectable()
export class PasswordVarificationService {
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
  encryptPin(password: string, MSISDN: bigint): string {
    const hash = crypto
      .createHmac('sha256', this.secret)
      .update(password)
      .digest('hex');

    return hash;
  }

  verifyPassword(
    password: string,
    hashedPassword: string,
    MSISDN: bigint,
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

  async PINVerify(PIN: string, MSISDN: bigint) {
    const walletinfo = JSON.parse(
      JSON.stringify(
        await this.DB.query(
          `Exec dbo.WalletPinDetail @Msisdn = ${MSISDN}, @Flag = 'CheckWalletPin'`,
        ),
      ),
    );
    let match = false;
    if (walletinfo[0][0].PIN == null || walletinfo[0][0].Failed_Attempt > 2) {
      console.log(walletinfo);
      match = false;
    } else {
      match = await this.verifyPassword(PIN, walletinfo[0][0].PIN, MSISDN);
    }

    const result = {
      Passwordmatch: match,
      AccountStatus: +walletinfo[0][0].AccountStatus,
    };
    winstonLog.log('info', 'WALLET DETAILS: %s', walletinfo, {
      label: 'JSONRX_PINVARIFICATION',
    });

    winstonLog.log('info', 'PASSWORD VERIFICATION RESULT %s', result, {
      lable: 'JSONRX_PINVARIFICATION',
    });
    return result;
  }

  generateOtp() {
    const otp =  crypto.randomInt(1000000).toString().padStart(6, '0');
    return otp;
  }
}