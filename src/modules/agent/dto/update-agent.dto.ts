import { PartialType } from '@nestjs/mapped-types';
import { TransactionDto } from './create-agent.dto';

export class UpdateAgentDto extends PartialType(TransactionDto) {}
