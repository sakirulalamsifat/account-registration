import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import {
  TransactionDto,
  TransactionTopDto,
  PinChangeDto,
  BalanceDto,
} from './dto/create-agent.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthmodeAuthGuard } from '../auth/authmode-auth.guard';
@Controller('account')
export class AgentController {
  constructor(private readonly agentbankingService: AgentService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/balance/:Accountnumber')
  balance(@Param('Accountnumber') Accountnumber) {
    return this.agentbankingService.balancecheck(+Accountnumber);
  }
  @UseGuards(AuthmodeAuthGuard)
  @Post('/balance')
  balanceussd(@Body() balanceDto: BalanceDto) {
    return this.agentbankingService.balancecheckussd(balanceDto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/transactionhistory')
  transactionhistory(@Body() transactionDto: TransactionDto) {
    return this.agentbankingService.transactionhistory(transactionDto);
  }
  @UseGuards(AuthmodeAuthGuard)
  @Post('/transactiontopfivehistory')
  transactiontopfivehistory(@Body() transactionTopDto: TransactionTopDto) {
    return this.agentbankingService.transactiontopfivehistory(
      transactionTopDto,
    );
  }
  @UseGuards(AuthmodeAuthGuard)
  @Post('/pinchange')
  async pinchange(@Body() pinChangeDto: PinChangeDto) {
    try {
      return this.agentbankingService.pingchange(pinChangeDto);
    } catch (e) {
      console.log(e.validationErrors);
      return e;
    }
  }

  /* @Post('/pinreset')
  pinreset(@Body() createAgentbankingDto: OffnetWithdrawalDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Post('/setsecurityquestion')
  setsecurityquestion(@Body() createAgentbankingDto: CreateAgentbankingDto) {
    return this.agentbankingService.create(createAgentbankingDto);
  }
  @Get('/securityquestion')
  getsecurityquestion() {
    return this.agentbankingService.findAll();
  }*/
}
