import { Controller, Post, Body, Get, Param, UseGuards,Request } from '@nestjs/common';
import { SecurityService } from './security.service';
import { PinChangeDto } from '../agent/dto/create-agent.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthmodeAuthGuard } from '../auth/authmode-auth.guard';
import { BasicAuthGuard } from '../auth/basicauth-auth.guard';
@Controller('security')
export class AgentController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('/createQuestion')
  createSecurityquestion(@Body() reqbody: any) {
    return this.securityService.createSecurityQuestion(reqbody);
  }

  @Post('/getQuestionList')
  getSecurityquestion(@Body() reqbody: any) {
    return this.securityService.questionListapi(reqbody);
  }

  @Post('/approveQuestion')
  approveSecurityquestion(@Request() req, @Body() reqbody: any) {
    return this.securityService.approveSecurityQuestion(req);
  }
  @UseGuards(AuthmodeAuthGuard)
  @Post('/questionAnswerSet')
  setSecurityAnswer(@Body() reqbody: any) {
    return this.securityService.saveAnswerToQuestion(reqbody);
  }

  @Post('/resetPin')
  resetPin(@Body() reqbody: any, @Body() pinchangeDto:PinChangeDto) {
    return this.securityService.resetPin(reqbody, pinchangeDto);
  }
}
