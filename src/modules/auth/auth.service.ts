import { Injectable, Inject } from '@nestjs/common';
import { JsonrxModel } from '../../models';
import { USER_REPOSITORY, DATABASE_CONNECTION } from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof JsonrxModel,
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    Msisdn: string,
    FullName: string,
    AppVersion: string,
    PhoneBrand: string,
    PhoneOs: string,
    OsVersion: string,
    authorization: string,
  ): Promise<any> {
    const payload = await this.DB.query(
      `EXEC dbo.SW_PROC_VERIFY_JSONRX_REGISTRATION @FLAG = 'ValidateDevice', @Msisdn =  ${Msisdn}, @Imei ='${FullName}', @AppVersion = '${AppVersion}', @PhoneBrand= '${PhoneBrand}',@PhoneOs = '${PhoneOs}',@OsVersion = '${OsVersion}'`,
    );
    const data = JSON.stringify(payload);
    const obj = JSON.parse(data);
    if (obj[0][0].Code == 100) {
      console.log('CUSTOMER REGISTRATION IS VALID');
      let varification = Buffer.from(
        `${Msisdn}:${obj[0][0].Device_Password}`,
      ).toString('base64');
      varification = `Basic ${varification}`;
      console.log(varification);
      if (authorization == varification) {
        console.log('Authorized');
        const payload = { username: Msisdn, sub: authorization };
        const token = this.jwtService.sign(payload);
        const update = await this.update(Msisdn, token);
        console.log(update);
        return {
          access_token: token,
        };
      } else {
        console.log('UNAUTHORIZED');
        return null;
      }
    } else {
      console.log('User not registered');
      return null;
    }
  }

  async update(Msisdn: string, ACCESS_TOKEN: string) {
    return this.userRepository
      .update<JsonrxModel>(
        { ACCESS_TOKEN: ACCESS_TOKEN },
        { where: { Msisdn: Msisdn } },
      )
      .then(() => {
        return { RESPONSECODE: '100' };
      })
      .catch((error) => {
        return { RESPONSECODE: error };
      });
  }
}
