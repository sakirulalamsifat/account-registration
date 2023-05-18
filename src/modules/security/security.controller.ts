import { Controller, Post, Body, Get, Param, UseGuards,Request } from '@nestjs/common';
import { SecurityService } from './security.service';
import { PinResetDto } from './dto/pin-reset.dto';
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

  @UseGuards(AuthmodeAuthGuard)
  @Post('/AnswerSecurityQuestion')
  AnswerSecurityQuestion(@Body() reqbody: any) {
    return this.securityService.answerToQuestion(reqbody);
  }


  @UseGuards(AuthmodeAuthGuard)
  @Post('/resetPin')
  resetPin(@Body() reqbody: any, @Body() pinchangeDto:PinResetDto) {
    return this.securityService.resetPin(reqbody, pinchangeDto);
  }

  @UseGuards(AuthmodeAuthGuard)
  @Post('/createDormant')
  creatDormant(@Body() reqbody: any) {
    return this.securityService.createDormantConfig(reqbody);
  }

  @UseGuards(AuthmodeAuthGuard)
  @Post('/updateDormant')
  updateDormant(@Body() reqbody: any) {
    return this.securityService.updateDormantConfig(reqbody, );
  }

  @UseGuards(AuthmodeAuthGuard)
  @Post('/deleteDormant')
  deleteDormant(@Body() reqbody: any) {
    return this.securityService.deleteDormantConfig(reqbody);
  }

  @UseGuards(AuthmodeAuthGuard)
  @Post('/DormantList')
  listDormant(@Body() reqbody: any) {
    return this.securityService.DormantConfigList(reqbody);
  }

  @UseGuards(AuthmodeAuthGuard)
  @Post('/DormantAction')
  dormantAction(@Body() reqbody: any) {
    return this.securityService.pendingDormantAction(reqbody);
  }
}
