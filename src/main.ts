import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { expressBind } from 'i18n-2';
//import { localize } from './middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressListRoutes from 'express-list-routes';
import * as winston from 'winston';
import { LogsService } from './modules/agent/log.service';
import { LogTransport } from './modules/Log/log.transport';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  
} from 'nest-winston';
import { winstonLog } from './config/winstonLog';

//import { AuthModuleGuard } from './middleware/guards';
async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const instance = winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
          }),
          winston.format.ms(),
          winston.format.align(),
          nestWinstonModuleUtilities.format.nestLike('FINIFY_REZ', {
            colors: true,
            prettyPrint: true,
            // options
          }),
        ),
      }),
      new winston.transports.File({
        filename: './log/combined.log',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
          }),
          winston.format.ms(),
          winston.format.align(),
          nestWinstonModuleUtilities.format.nestLike('FINIFY_REZ', {
            colors: true,
            // options
          }),
        ),
        level: 'debug',
      }),
      new winston.transports.File({
        level: 'error',
        filename: './log/app-error.log',

        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
          }),
          winston.format.ms(),
          winston.format.align(),
          nestWinstonModuleUtilities.format.nestLike('FINIFY_REZ', {
            colors: true,
            // options
          }),
        ),
      }),
    
      // other transports...
    ],
    // other options
    // options (same as WinstonModule.forRoot() options)
  });
  // options of Winston

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  //const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = new DocumentBuilder()
    .setTitle('ACCOUNT INFO MODULE')
    .setDescription('This Module is CORE FINITY MODULE')
    .setVersion('1.0')
    .addTag('core')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('accservice', app, document);
  app.setGlobalPrefix('v1/accservice');
  app.enableCors();

  // expressBind(app, { locales: ['en'] });
  // app.use(localize);

  app.useGlobalPipes(new ValidationPipe());
  //use globally to check auth module from request header
  // app.useGlobalGuards(new AuthModuleGuard());
  await app.listen(process.env.PORT || 3000);
  console.log(`LISTING TO PORT ${process.env.PORT}`);
  const server = app.getHttpServer();
  //const router = server._events.request._router;
 // winstonLog.log('info', 'API %s', expressListRoutes({}, 'API:', router));
}
bootstrap();
