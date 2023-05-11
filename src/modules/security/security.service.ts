import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import {
  SecurityQuestionHistoryModel,
  SecurityQuestionModel,
  SecurityQuestionTempModel,
  SecurityQuestionAnswerModel,
  AgentPorfileModel,
  MerchantProfileModel,
  CustomerProfileModel
} from '../../models';
import { PinChangeDto } from '../agent/dto/create-agent.dto';
import {
  SW_TBL_SECURITY_QUESTION,
  SW_TBL_SECURITY_QUESTION_HISTORY,
  SW_TBL_SECURITY_QUESTION_TEMP,
  SW_TBL_SECURITY_QUESTION_ANSWER_SET,
  SW_TBL_PROFILE_AGENTS,
  SW_TBL_PROFILE_CUST,
  SW_TBL_PROFILE_MERCHANT
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { log } from 'winston';
import { PasswordService } from '../agent/password.service';
import { NotificationService } from '../agent/notification.service';

@Injectable()
export class SecurityService {
  constructor(
    @Inject(SW_TBL_SECURITY_QUESTION)
    private readonly securityQuestionRepo: typeof SecurityQuestionModel,
    @Inject(SW_TBL_SECURITY_QUESTION_HISTORY)
    private readonly securityQuestionHistoryRepo: typeof SecurityQuestionHistoryModel,
    @Inject(  SW_TBL_SECURITY_QUESTION_TEMP)
    private readonly securityQuestionTempRepo: typeof SecurityQuestionTempModel,
    @Inject(  SW_TBL_SECURITY_QUESTION_ANSWER_SET)
    private readonly securityQuestionAnswerRepo: typeof SecurityQuestionAnswerModel,
    @Inject(  SW_TBL_PROFILE_AGENTS)
    private readonly agentProfile: typeof AgentPorfileModel,
    @Inject(  SW_TBL_PROFILE_CUST)
    private readonly customerProfile: typeof CustomerProfileModel,
    @Inject(  SW_TBL_PROFILE_MERCHANT)
    private readonly merchantProfile: typeof MerchantProfileModel,
    private readonly passwordService: PasswordService,
    private readonly notificationService:NotificationService,
    private readonly logger: Logger,
  ) {}


  //6 digit pin generator function

  async generateSixDigitRandomNumber():Promise<Number> {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  // Create Security Question

  async createSecurityQuestion(reqbody) {


    const {Question_Description,Question_Description_Local,created_by} = reqbody

    const createBody = {
      Question_Description,
      Created_By:created_by,
      Created_Date: Sequelize.fn('getdate'),
      Question_Description_Local,
      Action:'INSERT'
      
    }

    await this.securityQuestionTempRepo.create( createBody )

    return await this.securityQuestionHistoryRepo.create(createBody)
  }

  async questionListapi(reqbody) {

    const { Msisdn } = reqbody

    const question_length=process.env.SECURITY_QUESTION_LENGTH
    let question_id=[]
    const findAnswerQuestion = await this.securityQuestionAnswerRepo.findAll({ where: { Wallet_MSISDN: Msisdn } })
    for (let id of findAnswerQuestion) {
      question_id.push(id.Question_ID)
    }

    let SecurityQuestionListWithoutLength=[]
    let SecurityQuestionList=[]
    
    if (findAnswerQuestion.length !== 0) {
      const questions = await this.securityQuestionRepo.findAll({ where: { Question_ID: question_id} })
      for (let question of questions) {
        
        const data =
        {
          QuestionId: question.Question_ID,
          Question: question.Question_Description,
          Answer: null,
          QuestionLocal: question.Question_Description_Local
        }
        SecurityQuestionListWithoutLength.push(data)
      }

      if (SecurityQuestionListWithoutLength.length > Number(question_length)) {
        SecurityQuestionList = SecurityQuestionListWithoutLength.slice(0, Number(question_length))
     
      } else {
        SecurityQuestionList=SecurityQuestionListWithoutLength
      }

      console.log('answer')
      return {
        SecurityQuestionList,
        Msisdn: Msisdn ,
        ResponseCode: 100,
        ResponseDescription: "Success",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
      
    } else {
      const questions = await this.securityQuestionRepo.findAll({ limit: Number(process.env.SECURITY_QUESTION_LENGTH) })
      for (let question of questions) {
        const data =
        {
          QuestionId: question.Question_ID,
          Question: question.Question_Description,
          Answer: null,
          QuestionLocal: question.Question_Description_Local
        }

        SecurityQuestionList.push(data)
      }

      console.log('without answer')
      return {
        SecurityQuestionList,
        Msisdn: Msisdn ,
        ResponseCode: 100,
        ResponseDescription: "Success",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
    }
    
  }

  async editSecurityQuestion(reqbody) {


    const {Question_Description,Question_Description_Local,created_by} = reqbody

    const createBody = {
      Question_Description,
      Created_By:created_by,
      Created_Date: Sequelize.fn('getdate'),
      Question_Description_Local,
      Action:'INSERT'
      
    }

    await this.securityQuestionTempRepo.create( createBody )

    return await this.securityQuestionHistoryRepo.create(createBody)
  }
  
  async approveSecurityQuestion(reqbody) {

 

    const {question_id, created_id} = reqbody

    const pendingQuestion = await this.securityQuestionTempRepo.findOne({ where: { Question_ID: question_id } })
    
    if (pendingQuestion.Question_ID !== created_id) {
      const perRepo = await this.securityQuestionRepo.create({
        Question_Description: pendingQuestion.Question_Description,
        created_by: pendingQuestion.Created_By,
        Created_Date: Sequelize.fn('getdate'),
        Question_Description_Local: pendingQuestion.Question_Description_Local,
        Approved_By:created_id
      })

      const hisRepo= await this.securityQuestionHistoryRepo.create({
        Question_Description: pendingQuestion.Question_Description,
        created_by: pendingQuestion.Created_By,
        Created_Date: Sequelize.fn('getdate'),
        Question_Description_Local: pendingQuestion.Question_Description_Local,
        Approved_By:created_id
      })

      return true
    }

    else {
      return 'you cannot approve this'
    }

  }
  
  async saveAnswerToQuestion(reqbody) {

    

    const {SecurityQuestionList=[], Pin, Msisdn} = reqbody
    
    const question_length=process.env.SECURITY_QUESTION_LENGTH
    // const createBody = {
    //   Wallet_MSISDN,
    //   Question_ID,
    //   Answer,
    //   Created_Date: Sequelize.fn('getdate'),
      
      
    // }

    // console.log('body', createBody)

    // await this.securityQuestionAnswerRepo.create({
    //   Wallet_MSISDN: Wallet_MSISDN,
    //   Question_ID: Question_ID,
    //   Answer: Answer,
    //   Created_Date: Sequelize.fn('getdate')
    // }, { logging: console.log })

    if (SecurityQuestionList.length > question_length) {
      const newQuestion = SecurityQuestionList.slice(0, question_length)

      for (let question of newQuestion) {
        const data = await this.securityQuestionAnswerRepo.create({
          Wallet_MSISDN: Msisdn,
            Question_ID: question.QuestionId,
            Answer: question.Answer,
            Created_Date: Sequelize.fn('getdate')
        })
      }

      //const data = await this.securityQuestionAnswerRepo.bulkCreate(newQuestion)
      
      return {
        Msisdn:Msisdn ,
        ResponseCode: 100,
        ResponseDescription: "Successful",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
    } else {

      for (let question of SecurityQuestionList) {
        const data = await this.securityQuestionAnswerRepo.create({
          Wallet_MSISDN: Msisdn,
            Question_ID: question.QuestionId,
            Answer: question.Answer,
            Created_Date: Sequelize.fn('getdate')
        })
      }

      //const data = await this.securityQuestionAnswerRepo.bulkCreate(newQuestion)
      
      return {
        Msisdn:Msisdn ,
        ResponseCode: 100,
        ResponseDescription: "Successful",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }

      // const data=await this.securityQuestionAnswerRepo.bulkCreate(SecurityQuestionList)


      // return data
    }

   
  }

  async answerToQuestion(reqbody) {
    const { Msisdn, SecurityQuestionList = [] } = reqbody
    
    const question_length=process.env.SECURITY_QUESTION_LENGTH
    
    const agent = await this.agentProfile.findOne({ where: { MSISDN: Msisdn } })
    const customer = await this.customerProfile.findOne({ where: { MSISDN: Msisdn } })
    const merchant = await this.merchantProfile.findOne({ where: { MSISDN: Msisdn } })
    let bodyAnswers = []
    let dataAnswers = []
    let questionAnswerFormat = []
    let compare
    
    function filterObjects(arr1, arr2) {
      return arr1.filter((obj1) => {
        return arr2.some((obj2) => obj2.Question_ID === obj1.Question_ID);
      });
    }

    function compareArrays(a, b) {
    
      for (let i = 0; i < a.length; i++) {
        const objA = a[i];
        const objB = b.find((obj) => obj.Question_ID === objA.Question_ID);
    
        if (!objB || objB.Answer !== objA.Answer) {
          return false;
        }
      }
    
      return true;
    }
    
      const findQuestion = await this.securityQuestionAnswerRepo.findAll({ where: { Wallet_MSISDN: Msisdn }, limit: Number(question_length) })
      
      //from body

      if (SecurityQuestionList.length > Number(question_length)) {
        questionAnswerFormat = SecurityQuestionList.slice(0, Number(question_length))
        for (let answer of questionAnswerFormat) {
          let data = { Question_ID: answer.QuestionId, Answer: answer.Answer }
          bodyAnswers.push(data)
        }

      } else {
        for (let answer of SecurityQuestionList) {
          let data = { Question_ID: answer.QuestionId, Answer: answer.Answer }
          bodyAnswers.push(data)
        }
      }

      for (let datanswer of findQuestion) {
        let data = { Question_ID: datanswer.Question_ID, Answer: datanswer.Answer }
        dataAnswers.push(data)
      }
      
   
      if (bodyAnswers.length !== dataAnswers.length) {
        const filteredArr = filterObjects(dataAnswers, bodyAnswers);
         compare=compareArrays(filteredArr,bodyAnswers)
    } else{
        compare=compareArrays(dataAnswers,bodyAnswers)
    }
    if (compare == true) {
      return {
        PinResetAttempt: 0,
        SecurityQuestionList: [],
        Msisdn: Msisdn,
        ResponseCode: 100,
        ResponseDescription: "Success",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
    } else {
      throw new BadRequestException('Answer Does to match')
    }
       
        
        // const notificationtempbody = {
        //   KEYWORD: '',
        //   SourceMsisdn: msisdn,
        //   PIN: generatedPin.toString(),
        //   templateID: 'PRST',
        //   LANG: 'ENG',
        // };
        // return {
        //   ResponseCode: 100,
        //   ResponseDescription:
        //     await this.notificationService.getPINChangeNotification(
        //       notificationtempbody,
        //     ),
        //   TransactionID: 0,
        // };

        
      
    




  }



  async resetPin(reqbody, pinChangeDto:PinChangeDto) {
    const { msisdn, question_answer = [] } = reqbody
    
    const question_length=process.env.SECURITY_QUESTION_LENGTH
    
    const agent = await this.agentProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    const customer = await this.customerProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    const merchant = await this.merchantProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    
    if (agent !== null) {
      const findQuestion = await this.securityQuestionAnswerRepo.findOne({ where: { Wallet_MSISDN: msisdn }} )
      
      if (findQuestion.Answer === question_answer) {
        const generatedPin = await this.generateSixDigitRandomNumber()

        const newpin = this.passwordService.encryptPassword(
          generatedPin.toString(),
          msisdn,
        );

        console.log('newPin', newpin);

        const updatePin = await this.agentProfile.update({ PIN: newpin }, { where: { MSISDN: msisdn } })
        
        return {
            ResponseCode: 100,
            ResponseDescription:
             'Pin reset for agent '
              ,
            TransactionID: 0,
          }
        
        // const notificationtempbody = {
        //   KEYWORD: '',
        //   SourceMsisdn: msisdn,
        //   PIN: generatedPin.toString(),
        //   templateID: 'PRST',
        //   LANG: 'ENG',
        // };
        // return {
        //   ResponseCode: 100,
        //   ResponseDescription:
        //     await this.notificationService.getPINChangeNotification(
        //       notificationtempbody,
        //     ),
        //   TransactionID: 0,
        // };

        
      } else {
         throw new BadRequestException('Answer Does to match')
      }
    }

    if (customer !== null) {
      const findQuestion = await this.securityQuestionAnswerRepo.findOne({ where: { Wallet_MSISDN: msisdn } })
      
      if (findQuestion.Answer === question_answer) {
        const generatedPin = await this.generateSixDigitRandomNumber()

        const newpin = this.passwordService.encryptPassword(
          generatedPin.toString(),
          msisdn,
        );

        console.log('newPin', newpin);

        const updatePin = await this.customerProfile.update({ PIN: newpin }, { where: { MSISDN: msisdn } })
        
        return {
          ResponseCode: 100,
          ResponseDescription:
           'Pin reset for agent '
            ,
          TransactionID: 0,
        }
        
        // const notificationtempbody = {
        //   KEYWORD: '',
        //   SourceMsisdn: msisdn,
        //   PIN: generatedPin.toString(),
        //   templateID: 'PRST',
        //   LANG: 'ENG',
        // };
        // return {
        //   ResponseCode: 100,
        //   ResponseDescription:
        //     await this.notificationService.getPINChangeNotification(
        //       notificationtempbody,
        //     ),
        //   TransactionID: 0,
        // };

        
      } else {
         throw new BadRequestException('Answer Does to match')
      }
    }

    if (merchant !== null) {
      const findQuestion = await this.securityQuestionAnswerRepo.findOne({ where: { Wallet_MSISDN: msisdn } })
      
      if (findQuestion.Answer === question_answer) {
        const generatedPin = await this.generateSixDigitRandomNumber()

        const newpin = this.passwordService.encryptPassword(
          generatedPin.toString(),
          msisdn,
        );

        console.log('newPin', newpin);

        const updatePin = await this.merchantProfile.update({ PIN: newpin }, { where: { MSISDN: msisdn } })
        
        return {
          ResponseCode: 100,
          ResponseDescription:
           'Pin reset for merchant '
            ,
          TransactionID: 0,
        }
        
        // const notificationtempbody = {
        //   KEYWORD: '',
        //   SourceMsisdn: msisdn,
        //   PIN: generatedPin.toString(),
        //   templateID: 'PRST',
        //   LANG: 'ENG',
        // };
        // return {
        //   ResponseCode: 100,
        //   ResponseDescription:
        //     await this.notificationService.getPINChangeNotification(
        //       notificationtempbody,
        //     ),
        //   TransactionID: 0,
        // };

        
      } else {
         throw new BadRequestException('Answer Does to match')
      }
    }
  }

}
