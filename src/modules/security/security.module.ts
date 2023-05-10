import { Module, Logger } from '@nestjs/common';
import { SecurityService } from './security.service';
import { DatabaseModule } from '../../config/database/database.module';
import { AgentController } from './security.controller';;
import { ClientsModule, Transport } from '@nestjs/microservices';
import { securityProviders } from './security.providers';
import { AgentModule } from '../agent/agent.module';

@Module({
  controllers: [AgentController],
  providers: [
    SecurityService,
    ...securityProviders,
    Logger,
  ],
  imports: [DatabaseModule, AgentModule],
})
export class SecurityModule {}
