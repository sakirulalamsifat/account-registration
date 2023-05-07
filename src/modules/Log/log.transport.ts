/*
https://docs.nestjs.com/microservices/custom-transport#custom-transporters
*/

import { LogModel } from '../../models';
import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION, LOG_REPOSITORY } from '../../config/constants';
import { transport, transports, createLogger, format } from 'winston';
import { Sequelize } from 'sequelize-typescript';
class LogTransport extends transport {
  constructor(
    @Inject(DATABASE_CONNECTION) private sequlize: Sequelize,
    @Inject(LOG_REPOSITORY)
    private readonly logRepository: typeof LogModel,
  ) {
    super();
  }
  /**
   * This method is triggered when you run "app.listen()".
   */
  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const body = {
      level: info.level,
      message: info.message,
      timestamp: info.timestamp,
      module: info.module,
    };
    this.logRepository
      .create(body)
      .then(() => {
        callback();
      })
      .catch((err) => {
        console.error('Error inserting log into the database:', err);
        callback();
      });
  }
}
export { LogTransport };
