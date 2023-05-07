import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION, LOG_REPOSITORY } from '../../config/constants';
import { LogModel } from '../../models';
import { Sequelize } from 'sequelize-typescript';
import { createLogger, format, transports } from 'winston';
@Injectable()
export class LogsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private DB: Sequelize,
    @Inject(LOG_REPOSITORY)
    private readonly logRepository: typeof LogModel,
  ) {}
 
  async createLog(
    level: string,
    message: string,
    timestamp: Date,
    module: string,
  ) {
    const body = {
      level: level,
      message: message,
      timestamp: timestamp,
      module: module,
    };
    return await this.logRepository.create(body);
  }

  async getAllLogs() {
    return await this.logRepository.findAll();
  }
}
