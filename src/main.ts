import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { expressBind } from 'i18n-2';
//import { localize } from './middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressListRoutes from 'express-list-routes';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

//import { AuthModuleGuard } from './middleware/guards';
async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('PaymentProcess', {
              // options
            }),
          ),
        }),
        // other transports...
      ],
      // other options
      // options (same as WinstonModule.forRoot() options)
    }),
  });
  const config = new DocumentBuilder()
    .setTitle('CORE MODULE')
    .setDescription('This Module is CORE FINITY MODULE')
    .setVersion('1.0')
    .addTag('core')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('v1/api');
  app.enableCors();

  // expressBind(app, { locales: ['en'] });
  // app.use(localize);

  //  app.useGlobalPipes(new ValidateInputPipe());
  //use globally to check auth module from request header
  // app.useGlobalGuards(new AuthModuleGuard());
  await app.listen(process.env.PORT || 3000);
  console.log(`LISTING TO PORT ${process.env.PORT}`);
  const server = app.getHttpServer();
  const router = server._events.request._router;
  console.log(expressListRoutes({}, 'API:', router));
}
bootstrap();