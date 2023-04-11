import { Injectable, Inject, Body, Logger } from '@nestjs/common';
import { NotificationModel } from '../../models';
import {
  DATABASE_CONNECTION,
  NOTIFICATION_REPOSITORY,
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import {
  NotificationDto,
  NotificationBalanceDto,
  NotificationPinChangeDto,
} from './dto/notification.dto';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: typeof NotificationModel,
    @Inject('kafka_module')
    private readonly client: ClientKafka,
    private readonly logger: Logger,
  ) {}
  //KAFKA
  async onModuleInit() {
    [process.env.KAFKA_REQ_TOPIC].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
  //send notificaiton over SMS and email and push notification
  async smsnotification(SMS: string, MSISDN: string, Smsflag: string) {
    const request = {
      Msisdn: MSISDN,
      Message: SMS,
      SMSFLAG: Smsflag,
    };
    this.logger.log('Messeage Send -> ' + JSON.stringify(request));
    const kafkaresponse = this.client.emit(
      process.env.KAFKA_NOTIFICATION_TOPIC,
      JSON.stringify(request),
    );
    this.logger.debug('KAFKARESPONSE:', JSON.stringify(kafkaresponse));
  }
  //This function responsible for responding balance query
  async getNotification(
    @Body() notificationbalanceDto: NotificationBalanceDto,
  ) {
    const response = await this.notificationRepository.findOne({
      where: {
        [Op.and]: [
          { keyword: notificationbalanceDto.KEYWORD },
          { language: notificationbalanceDto.LANG },
          { templateType: notificationbalanceDto.templateID },
        ],
      },
    });
    let notification = response.notificationTemplate;

    notification = notification.replace(
      /<SourceMsisdn>/g,
      notificationbalanceDto.SourceMsisdn,
    );

    notification = notification.replace(
      /<Amount>/g,
      String(notificationbalanceDto.Amount),
    );
    notification = notification.replace(
      /<RewardPoints>/g,
      String(notificationbalanceDto.RewardPoints),
    );
    this.logger.log(notification, 'FINAL NOTIFICATION FOR BALANCE');
    this.smsnotification(
      notification,
      notificationbalanceDto.SourceMsisdn,
      response.sendSms,
    );
    return notification;
  }
  //this function responsible pin change notification
  async getPINChangeNotification(
    @Body() notificationpinchangeDto: NotificationPinChangeDto,
  ) {
    const response = await this.notificationRepository.findOne({
      where: {
        [Op.and]: [
          { keyword: notificationpinchangeDto.KEYWORD },
          { language: notificationpinchangeDto.LANG },
          { templateType: notificationpinchangeDto.templateID },
        ],
      },
    });
    let notification = response.notificationTemplate;

    notification = notification.replace(
      /<SourceMsisdn>/g,
      notificationpinchangeDto.SourceMsisdn,
    );

    notification = notification.replace(
      /<Pin>/g,
      String(notificationpinchangeDto.PIN),
    );

    console.log(notification);
    await this.smsnotification(
      notification,
      notificationpinchangeDto.SourceMsisdn,
      response.sendSms,
    );
    return notification;
  }
  async getTransactionNotification(
    notificationDto: NotificationDto,
    transaction: string,
  ) {
    const response = await this.notificationRepository.findOne({
      where: {
        [Op.and]: [
          { keyword: notificationDto.KEYWORD },
          { language: notificationDto.LANG },
          { templateType: notificationDto.templateID },
        ],
      },
    });
    let notification = response.notificationTemplate;
    notification = notification.replace(
      /<SourceMsisdn>/g,
      notificationDto.SourceMsisdn,
    );
    this.logger.debug(notification, 'NOTIFICATION SEND TO USSD');
    this.smsnotification(
      transaction,
      notificationDto.SourceMsisdn,
      response.sendSms,
    );
    this.logger.log(notification, 'FINAL NOTIFICATION FOR PIN CHANGE');
    return notification;
  }
  //this is for failed notification
  async getFailNotification(@Body() notificationDto: NotificationDto) {
    const response = await this.notificationRepository.findOne({
      where: {
        [Op.and]: [
          { language: notificationDto.LANG },
          { templateType: notificationDto.templateID },
        ],
      },
    });
    const notification = response.notificationTemplate;

    console.log(notification);
    await this.smsnotification(
      notification,
      notificationDto.SourceMsisdn,
      response.sendSms,
    );
    this.logger.log(notification, 'FINAL NOTIFICATION FOR FAILED TRANSACTION');
    return notification;
  }
}
