import { Module, Logger } from '@nestjs/common';
import { SecurityService } from './security.service';
import { PasswordVarificationService } from './passwordVarifivation.service';
import { DatabaseModule } from '../../config/database/database.module';
import { AgentController } from './security.controller';;
import { ClientsModule, Transport } from '@nestjs/microservices';
import { securityProviders } from './security.providers';
import { AgentModule } from '../agent/agent.module';

@Module({
  controllers: [AgentController],
  providers: [
    SecurityService,
    PasswordVarificationService,
    ...securityProviders,
    Logger,
  ],
  imports: [DatabaseModule, AgentModule,
    ClientsModule.register([
      {
        name: 'kafka_module',
        transport: Transport.KAFKA,
        options: {
          client: {
            // clientId: 'kafka_client',
            // ssl: true,
            brokers: [process.env.KAFKA_BROKERS],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),],
})
export class SecurityModule {}
