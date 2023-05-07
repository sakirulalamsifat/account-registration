import { Module, Logger } from '@nestjs/common';
import { LogsService } from './log.service';
import { DatabaseModule } from '../../config/database/database.module';

import { userProviders } from './log.providers';

@Module({
  providers: [LogsService, ...userProviders, Logger],
  imports: [DatabaseModule],
  exports: [LogsService],
})
export class LogModule {}
