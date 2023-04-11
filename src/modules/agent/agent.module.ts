import { Module, Logger } from '@nestjs/common';
import { AgentService } from './agent.service';
import { DatabaseModule } from '../../config/database/database.module';
import { AgentController } from './agent.controller';
import { PasswordService } from './password.service';
import { NotificationService } from './notification.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { userProviders } from './agent.providers';

@Module({
  controllers: [AgentController],
  providers: [
    NotificationService,
    AgentService,
    PasswordService,
    ...userProviders,
    Logger,
  ],
  imports: [
    DatabaseModule,
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
    ]),
  ],
  exports: [PasswordService, AgentService, NotificationService],
})
export class AgentModule {}
