import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { AmlModel } from './payment.interface';

@Injectable()
export class AmlService {
  constructor(@Inject(DATABASE_CONNECTION) private DB: Sequelize) {}

  async AmlCheck(
    Source_Wallet_ID: string,
    Dest_Wallet_ID: string,
    Keyword: string,
    Amount: string,
  ): Promise<AmlModel> {
    const payload = await this.DB.query(
      `EXEC dbo.SW_PROC_AML_CHECK @MSISDN = ${Source_Wallet_ID},@Keyword = ${Keyword} ,@Amount = ${Amount} , @Dest_Wallet_ID = ${Dest_Wallet_ID}   `,
    );
    const data = JSON.parse(JSON.stringify(payload));

    return data[0][0];
  }

  async AmlCheckPersonal(
    Source_Wallet_ID: string,
    Dest_Wallet_ID: string,
    Keyword: string,
    Amount: string,
  ): Promise<AmlModel> {
    const payload = await this.DB.query(
      `EXEC dbo.SW_PROC_AML_CHECK_PERSONAL @MSISDN = ${Source_Wallet_ID},@Keyword = ${Keyword} ,@Amount = ${Amount} , @Dest_Wallet_ID = ${Dest_Wallet_ID}   `,
    );
    const data = JSON.parse(JSON.stringify(payload));

    return data[0][0];
  }
}
