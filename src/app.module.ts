import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogModule } from './modules/Log/log.module';
import { AgentModule } from './modules/agent/agent.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AgentModule, AuthModule, LogModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
