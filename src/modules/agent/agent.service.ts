import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  TransactionDto,
  TransactionTopDto,
  PinChangeDto,
  BalanceDto,
} from './dto/create-agent.dto';
import { PasswordService } from './password.service';
import { NotificationService } from './notification.service';
import {
  JsonrxModel,
  AgentModel,
  WalletModel,
  TransactionModel,
} from '../../models';
import {
  DATABASE_CONNECTION,
  WALLET_REPOSITORY,
  TRANSACTION_REPOSITORY,
  JSONRX_REPOSITORY,
  TOPFIVE_REPOSITORY,
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import axios from 'axios'
import { winstonLog } from '../../config/winstonLog'


@Injectable()
export class AgentService {
  constructor(
    @Inject(WALLET_REPOSITORY)
    private readonly walletRepository: typeof WalletModel,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: typeof AgentModel,
    @Inject(JSONRX_REPOSITORY)
    private readonly jsonrxRepository: typeof JsonrxModel,
    @Inject(TOPFIVE_REPOSITORY)
    private readonly topfiveRepository: typeof TransactionModel,
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    private readonly passwordService: PasswordService,
    private readonly notificationService: NotificationService,
    private readonly logger: Logger,
  ) {}


  async getCustomerPoint(MSISDN) {

    const url = process.env.GET_POINT_URL
    const reqBody = { MSISDN }
    winstonLog.log('info',' %s api Request :  %o', url, reqBody, { label: 'Point-pull' })

    return await axios({
        url ,
        data: reqBody,
        method : 'POST',
        headers : {'Content-type': 'application/json' } 

    }).then(resp => {

        winstonLog.log('info',' %s api Response:  %o', url, resp.data, { label: 'Point-pull' })
        const { MembershipId, CurrentYearRewardPoint} = resp.data['payload']
        return { Current_Year_Reward_Point: CurrentYearRewardPoint, MembershipId}

    }).catch(e => {

        winstonLog.log('error', `${url} api Response %o`,e['response'] )

        return { Current_Year_Reward_Point: 0, MembershipId: '0'}
    })
  }


  // Generate Transaction ID

  async balancecheck(Wallet_MSISDN: number) {

    const [data,pointinfo] = await Promise.all([
      this.walletRepository.findOne({
        where: { Wallet_MSISDN },
        attributes: ['Wallet_MSISDN', 'Amount', 'Current_Year_Reward_Point'],
      }),
      this.getCustomerPoint(Wallet_MSISDN)
    ])

    // const data = await this.walletRepository.findOne({
    //   where: { Wallet_MSISDN },
    //   attributes: ['Wallet_MSISDN', 'Amount', 'Current_Year_Reward_Point'],
    // });

    if(data) {
      const { Wallet_MSISDN, Amount} = data['dataValues']
      return { Wallet_MSISDN, Amount, ...pointinfo }
    }

    return { Wallet_MSISDN, Amount: 0, Current_Year_Reward_Point: 0, MembershipId: '0' }
  }

  async PINVerify(PIN: string, MSISDN: string) {
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
      match = this.passwordService.verifyPassword(
        PIN,
        walletinfo[0][0].PIN,
        MSISDN,
      );
    }

    const result = {
      Passwordmatch: match,
      AccountStatus: +walletinfo[0][0].AccountStatus,
    };
    this.logger.log(walletinfo, 'WALLET DETAILS');

    this.logger.debug(result, 'PASSWORD VERIFICATION RESULT');
    return result;
  }
  async balancecheckussd(balanceDto: BalanceDto) {
    const match = await this.PINVerify(balanceDto.PIN, balanceDto.MSISDN);

    if (match.Passwordmatch === true && match.AccountStatus === 0) {

      const [balanceussd,pointinfo] = await Promise.all([
        this.walletRepository.findOne({
          where: { Wallet_MSISDN: balanceDto.MSISDN },
          attributes: ['Wallet_MSISDN', 'Amount', 'Current_Year_Reward_Point'],
        }),
        this.getCustomerPoint(balanceDto.MSISDN)
      ])

      // const balanceussd = await this.walletRepository.findOne({
      //   where: { Wallet_MSISDN: balanceDto.MSISDN },
      //   attributes: ['Wallet_MSISDN', 'Amount', 'Current_Year_Reward_Point'],
      // });
      this.logger.log(balanceussd.Amount, 'USER BALANCE');
      const notificationtempbody = {
        KEYWORD: balanceDto.KEYWORD,
        SourceMsisdn: balanceDto.MSISDN,
        Amount: balanceussd.Amount,
        RewardPoints: pointinfo.Current_Year_Reward_Point,
        templateID: 'BALN_CUSTOMER',
        LANG: 'ENG',
      };
      return {
        ResponseCode: 100,
        ResponseDescription: await this.notificationService.getNotification(
          notificationtempbody,
        ),
        TransactionID: 0,
      };
    } else {
      let notificationtempbody;
      if (match.AccountStatus == 6) {
        notificationtempbody = {
          KEYWORD: balanceDto.KEYWORD,
          SourceMsisdn: balanceDto.MSISDN,
          templateID: 'FAIL_ACCOUNT_LOCKED_SOURCE',
          LANG: balanceDto.LANG,
        };
      } else {
        notificationtempbody = {
          KEYWORD: balanceDto.KEYWORD,
          SourceMsisdn: balanceDto.MSISDN,
          templateID: 'FAIL_PININVALID',
          LANG: balanceDto.LANG,
        };
      }

      return {
        Responsecode: 101,
        ResponseDescription: await this.notificationService.getFailNotification(
          notificationtempbody,
        ),
        TransactionID: 0,
      };
    }
  }
  async transactionhistory(transactionDto: TransactionDto) {
    const topfive = JSON.parse(
      JSON.stringify(
        await this.topfiveRepository.findAll({
          where: {
            [Op.or]: [
              { Source_Wallet_ID: transactionDto.MSISDN },
              { Dest_Wallet_ID: transactionDto.MSISDN },
            ],
          },

          attributes: [
            'Transaction_ID',
            'Keyword_Description',
            'Source_Wallet_ID',
            'Dest_Wallet_ID',
            'Amount',
            'Status',
          ],
        }),
      ),
    );
    return topfive;
  }
  async transactiontopfivehistory(transactionTopDto: TransactionTopDto) {
    const match = await this.PINVerify(
      transactionTopDto.PIN,
      transactionTopDto.MSISDN,
    );
    if (match.Passwordmatch === true && match.AccountStatus === 0) {
      const topfive = JSON.parse(
        JSON.stringify(
          await this.topfiveRepository.findAll({
            where: {
              [Op.or]: [
                { Source_Wallet_ID: transactionTopDto.MSISDN },
                { Dest_Wallet_ID: transactionTopDto.MSISDN },
              ],
            },
            limit: 5,
            attributes: [
              'Transaction_ID',
              'Keyword_Description',
              'Source_Wallet_ID',
              'Dest_Wallet_ID',
              'Amount',
              'Status',
            ],
          }),
        ),
      );
      let dataString = process.env.TOPFIVE_TRANSACTION_MESSAGE;
      this.logger.debug(topfive, 'TOP FIVE TRANSACTION QUERY OUTPUT');
      for (const item of topfive) {
        const itemString = Object.values(item).join(',');
        dataString += `${itemString}|`;
      }
      const requestbody = {
        KEYWORD: transactionTopDto.KEYWORD,
        SourceMsisdn: transactionTopDto.MSISDN,
        templateID: 'STAT_TOPFIVE',
        LANG: transactionTopDto.LANG,
      };

      return {
        ResponseCode: 100,
        ResponseDescription:
          await this.notificationService.getTransactionNotification(
            requestbody,
            dataString,
          ),
        TransactionID: 0,
      };
    } else {
      let notificationtempbody;
      if (match.AccountStatus == 6) {
        notificationtempbody = {
          KEYWORD: transactionTopDto.KEYWORD,
          SourceMsisdn: transactionTopDto.MSISDN,
          templateID: 'FAIL_ACCOUNT_LOCKED_SOURCE',
          LANG: transactionTopDto.LANG,
        };
      } else {
        notificationtempbody = {
          KEYWORD: transactionTopDto.KEYWORD,
          SourceMsisdn: transactionTopDto.MSISDN,
          templateID: 'FAIL_PININVALID',
          LANG: transactionTopDto.LANG,
        };
      }
      return {
        Responsecode: 101,
        ResponseDescription: await this.notificationService.getFailNotification(
          notificationtempbody,
        ),
        TransactionID: 0,
      };
    }
  }
  async pingchange(pinChangeDto: PinChangeDto) {
    const match = await this.PINVerify(
      pinChangeDto.OLDPIN,
      pinChangeDto.MSISDN,
    );
    if (match.Passwordmatch === true && match.AccountStatus === 0) {
      const newpin = this.passwordService.encryptPassword(
        pinChangeDto.NEWPIN,
        pinChangeDto.MSISDN,
      );
      const notificationtempbody = {
        KEYWORD: pinChangeDto.KEYWORD,
        SourceMsisdn: pinChangeDto.MSISDN,
        PIN: pinChangeDto.NEWPIN,
        templateID: 'PRST',
        LANG: pinChangeDto.LANG,
      };
      return {
        ResponseCode: 100,
        ResponseDescription:
          await this.notificationService.getPINChangeNotification(
            notificationtempbody,
          ),
        TransactionID: 0,
      };
    } else {
      let notificationtempbody;
      if (match.AccountStatus == 6) {
        notificationtempbody = {
          KEYWORD: pinChangeDto.KEYWORD,
          SourceMsisdn: pinChangeDto.MSISDN,
          templateID: 'FAIL_ACCOUNT_LOCKED_SOURCE',
          LANG: pinChangeDto.LANG,
        };
      } else {
        notificationtempbody = {
          KEYWORD: pinChangeDto.KEYWORD,
          SourceMsisdn: pinChangeDto.MSISDN,
          templateID: 'FAIL_PININVALID',
          LANG: pinChangeDto.LANG,
        };
      }
      return {
        Responsecode: 101,
        ResponseDescription: await this.notificationService.getFailNotification(
          notificationtempbody,
        ),
        TransactionID: 0,
      };
    }
  }


}
