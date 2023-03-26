import { Controller, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import {
  CreateAgentbankingDto,
  OffnetWithdrawalDto,
} from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentbankingService: AgentService) {}

  @Post('/deposit')
  deposit(@Body() createAgentbankingDto: CreateAgentbankingDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Post('/withdraw')
  withdraw(@Body() createAgentbankingDto: CreateAgentbankingDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Post('/billpay')
  billpay(@Body() createAgentbankingDto: CreateAgentbankingDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Post('/offnetwithdraw')
  offnet(@Body() createAgentbankingDto: OffnetWithdrawalDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Post('/offnetwithdrawwithregistration')
  offnetregistration(@Body() createAgentbankingDto: CreateAgentbankingDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
}
