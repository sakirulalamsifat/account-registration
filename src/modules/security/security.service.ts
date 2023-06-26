import { Injectable, Inject, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  SecurityQuestionHistoryModel,
  SecurityQuestionModel,
  SecurityQuestionTempModel,
  SecurityQuestionAnswerModel,
  AgentPorfileModel,
  MerchantProfileModel,
  CustomerProfileModel,
  DormantHistoryModel,
  DormantModel,
  DormantTempModel
} from '../../models';
import { PinResetDto } from './dto/pin-reset.dto';
import { ClientKafka } from '@nestjs/microservices';
import {
  SW_TBL_SECURITY_QUESTION,
  SW_TBL_SECURITY_QUESTION_HISTORY,
  SW_TBL_SECURITY_QUESTION_TEMP,
  SW_TBL_SECURITY_QUESTION_ANSWER_SET,
  SW_TBL_PROFILE_AGENTS,
  SW_TBL_PROFILE_CUST,
  SW_TBL_PROFILE_MERCHANT,
  SW_TBL_DORMANT_CONFIG,
  SW_TBL_DORMANT_CONFIG_HISTORY,
  SW_TBL_DORMANT_CONFIG_TEMP,
  DATABASE_CONNECTION
} from '../../config/constants';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { log } from 'winston';
import { PasswordService } from '../agent/password.service';
import { NotificationService } from '../agent/notification.service';

@Injectable()
export class SecurityService {
  constructor(
    @Inject('kafka_module')
    private readonly client: ClientKafka,
    @Inject(SW_TBL_SECURITY_QUESTION)
    private readonly securityQuestionRepo: typeof SecurityQuestionModel,
    @Inject(SW_TBL_SECURITY_QUESTION_HISTORY)
    private readonly securityQuestionHistoryRepo: typeof SecurityQuestionHistoryModel,
    @Inject(SW_TBL_SECURITY_QUESTION_TEMP)
    private readonly securityQuestionTempRepo: typeof SecurityQuestionTempModel,
    @Inject(SW_TBL_SECURITY_QUESTION_ANSWER_SET)
    private readonly securityQuestionAnswerRepo: typeof SecurityQuestionAnswerModel,
    @Inject(SW_TBL_PROFILE_AGENTS)
    private readonly agentProfile: typeof AgentPorfileModel,
    @Inject(SW_TBL_PROFILE_CUST)
    private readonly customerProfile: typeof CustomerProfileModel,
    @Inject(SW_TBL_PROFILE_MERCHANT)
    private readonly merchantProfile: typeof MerchantProfileModel,
    @Inject(SW_TBL_DORMANT_CONFIG)
    private readonly dormantRepo: typeof DormantModel,
    @Inject(SW_TBL_DORMANT_CONFIG_HISTORY)
    private readonly dormantHistoryRepo: typeof DormantHistoryModel,
    @Inject(SW_TBL_DORMANT_CONFIG_TEMP)
    private readonly dormantTempRepo: typeof DormantTempModel,
    private readonly passwordService: PasswordService,
    private readonly notificationService: NotificationService,
    private readonly logger: Logger,
    @Inject(DATABASE_CONNECTION) private DB: Sequelize
  ) { }


  //6 digit pin generator function

  async generateSixDigitRandomNumber(): Promise<Number> {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  // Create Security Question

  async createSecurityQuestion(reqbody) {


    const { Question_Description, Question_Description_Local, created_by } = reqbody

    const createBody = {
      Question_Description,
      Created_By: created_by,
      Created_Date: Sequelize.fn('getdate'),
      Question_Description_Local,
      Action: 'INSERT'
      
    }

    await this.securityQuestionTempRepo.create(createBody)

    return await this.securityQuestionHistoryRepo.create(createBody)
  }

  async questionListapi(reqbody) {

    const { Msisdn } = reqbody

    const question_length = process.env.SECURITY_QUESTION_LENGTH
    let question_id = []
    const findAnswerQuestion = await this.securityQuestionAnswerRepo.findAll({ where: { Wallet_MSISDN: Msisdn } })
    for (let id of findAnswerQuestion) {
      question_id.push(id.Question_ID)
    }

    let SecurityQuestionListWithoutLength = []
    let SecurityQuestionList = []
    
    if (findAnswerQuestion.length !== 0) {
      const questions = await this.securityQuestionRepo.findAll({ where: { Question_ID: question_id } })
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
        SecurityQuestionList = SecurityQuestionListWithoutLength
      }

      console.log('answer')
      return {
        SecurityQuestionList,
        Msisdn: Msisdn,
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
        Msisdn: Msisdn,
        ResponseCode: 100,
        ResponseDescription: "Success",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
    }
    
  }

  async editSecurityQuestion(reqbody) {


    const { Question_Description, Question_Description_Local, created_by } = reqbody

    const createBody = {
      Question_Description,
      Created_By: created_by,
      Created_Date: Sequelize.fn('getdate'),
      Question_Description_Local,
      Action: 'INSERT'
      
    }

    await this.securityQuestionTempRepo.create(createBody)

    return await this.securityQuestionHistoryRepo.create(createBody)
  }
  
  async approveSecurityQuestion(reqbody) {

 

    const { question_id, created_id } = reqbody

    const pendingQuestion = await this.securityQuestionTempRepo.findOne({ where: { Question_ID: question_id } })
    
    if (pendingQuestion.Question_ID !== created_id) {
      const perRepo = await this.securityQuestionRepo.create({
        Question_Description: pendingQuestion.Question_Description,
        created_by: pendingQuestion.Created_By,
        Created_Date: Sequelize.fn('getdate'),
        Question_Description_Local: pendingQuestion.Question_Description_Local,
        Approved_By: created_id
      })

      const hisRepo = await this.securityQuestionHistoryRepo.create({
        Question_Description: pendingQuestion.Question_Description,
        created_by: pendingQuestion.Created_By,
        Created_Date: Sequelize.fn('getdate'),
        Question_Description_Local: pendingQuestion.Question_Description_Local,
        Approved_By: created_id
      })

      return true
    }

    else {
      return 'you cannot approve this'
    }

  }
  
  async saveAnswerToQuestion(reqbody) {

    

    const { SecurityQuestionList = [], Pin, Msisdn } = reqbody
    
    const question_length = process.env.SECURITY_QUESTION_LENGTH
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
        Msisdn: Msisdn,
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
        Msisdn: Msisdn,
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
    
    const question_length = process.env.SECURITY_QUESTION_LENGTH
    
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
      compare = compareArrays(filteredArr, bodyAnswers)
    } else {
      compare = compareArrays(dataAnswers, bodyAnswers)
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
      return {
        PinResetAttempt: 0,
        SecurityQuestionList: [],
        Msisdn: Msisdn,
        ResponseCode: 400,
        ResponseDescription: "Answers do not match",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
      }
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

  async emitKafkaPushNotif(data) {
    this.logger.log('Messeage Send -> ' + JSON.stringify(data));
    return this.client.emit(process.env.KAFKA_PUSH_NOTIFICATION_TOPIC, JSON.stringify(data))
  }



  async resetPin(reqbody, pinChangeDto: PinResetDto) {
    
    const agent = await this.agentProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    const customer = await this.customerProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    const merchant = await this.merchantProfile.findOne({ where: { MSISDN: pinChangeDto.MSISDN } })
    
    if (agent !== null) {
            
      const generatedPin = await this.generateSixDigitRandomNumber()

      const newpin = this.passwordService.encryptPassword(
        generatedPin.toString(),
        pinChangeDto.MSISDN,
      );

      console.log('newPin', newpin);

      const updatePin = await this.agentProfile.update({ PIN: newpin }, { where: { MSISDN: pinChangeDto.MSISDN } })
      
      const notificationData = {
        KEYWORD: pinChangeDto.KEYWORD,
        TemplateID: 'PRST',
        LANG: pinChangeDto.LANG,
        SourceMsisdn: pinChangeDto.MSISDN,
        Amount: '',
        DestinationMsisdn: pinChangeDto.MSISDN,
        OTP: '',
        RewardPoints: '',
        REFID: '',
        Pin: generatedPin.toString(),
        TransectionId: ''
      }
      this.emitKafkaPushNotif(notificationData)
        
      return {
          
        Msisdn: pinChangeDto.MSISDN,
        ResponseCode: 100,
        ResponseDescription: "PIN Successfully Reset",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
          
      }
        
     
    }

    if (customer !== null) {
      const generatedPin = await this.generateSixDigitRandomNumber()

      const newpin = this.passwordService.encryptPassword(
        generatedPin.toString(),
        pinChangeDto.MSISDN,
      );

      console.log('newPin', newpin);

      const updatePin = await this.customerProfile.update({ PIN: newpin }, { where: { MSISDN: pinChangeDto.MSISDN } })
      
      const notificationData = {
        KEYWORD: pinChangeDto.KEYWORD,
        TemplateID: 'PRST',
        LANG: pinChangeDto.LANG,
        SourceMsisdn: pinChangeDto.MSISDN,
        Amount: '',
        DestinationMsisdn: pinChangeDto.MSISDN,
        OTP: '',
        RewardPoints: '',
        REFID: '',
        Pin: generatedPin.toString(),
        TransectionId: ''
      }
      this.emitKafkaPushNotif(notificationData)
        
      return {
          
        Msisdn: pinChangeDto.MSISDN,
        ResponseCode: 100,
        ResponseDescription: "PIN Successfully Reset",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
        
      }
      
    }

    if (merchant !== null) {
      const generatedPin = await this.generateSixDigitRandomNumber()

      const newpin = this.passwordService.encryptPassword(
        generatedPin.toString(),
        pinChangeDto.MSISDN,
      );

      console.log('newPin', newpin);

      const updatePin = await this.merchantProfile.update({ PIN: newpin }, { where: { MSISDN: pinChangeDto.MSISDN } })
      
      const notificationData = {
        KEYWORD: pinChangeDto.KEYWORD,
        TemplateID: 'PRST',
        LANG: pinChangeDto.LANG,
        SourceMsisdn: pinChangeDto.MSISDN,
        Amount: '',
        DestinationMsisdn: pinChangeDto.MSISDN,
        OTP: '',
        RewardPoints: '',
        REFID: '',
        Pin: generatedPin.toString(),
        TransectionId: ''
      }
      this.emitKafkaPushNotif(notificationData)
        
      return {
          
        Msisdn: pinChangeDto.MSISDN,
        ResponseCode: 100,
        ResponseDescription: "PIN Successfully Reset",
        ResponseDescriptionLocal: null,
        TransactionId: null,
        data: null
        
      }
      
    }

    if (merchant == null && agent == null && customer == null) {
      throw new BadRequestException('MSISDN DOES NOT MATCH')
    }
  }

  async createDormantConfig(reqbody) {


    const { Wallet_Type, Dormant_Inactive_Days, created_by } = reqbody

    const createBody = {
      Wallet_Type,
      Created_By: created_by,
      Created_Date: Sequelize.fn('getdate'),
      Dormant_Inactive_Days,
      Operation: 'INSERT'
      
    }

    await this.dormantTempRepo.create(createBody)

    return await this.dormantHistoryRepo.create(createBody)
  }

  async updateDormantConfig(reqbody) {


    const { Row_Id, Wallet_Type, Dormant_Inactive_Days, created_by } = reqbody

    const createBody = {
      Wallet_Type,
      Created_By: created_by,
      Created_Date: Sequelize.fn('getdate'),
      Dormant_Inactive_Days,
      Operation: 'UPDATE',
      Main_Row_Id: Row_Id,
      Modified_Date: Sequelize.fn('getdate')
      
    }

    await this.dormantTempRepo.create(createBody)

    return await this.dormantHistoryRepo.create(createBody)
  }

  async deleteDormantConfig(reqbody) {


    const { Row_Id, Wallet_Type, Dormant_Inactive_Days, created_by } = reqbody

    const createBody = {
      Wallet_Type,
      Created_By: created_by,
      Created_Date: Sequelize.fn('getdate'),
      Dormant_Inactive_Days,
      Operation: 'DELETE',
      Main_Row_Id: Row_Id
      
    }

    await this.dormantTempRepo.create(createBody)

    return await this.dormantHistoryRepo.create(createBody)
  }

  async DormantConfigList(reqbody) {


    const { created_by } = reqbody

    const List = await this.dormantRepo.findAll()

    const myPendingList = await this.dormantTempRepo.findAll({ where: { Created_By: created_by } })

    const pendingList = await this.dormantTempRepo.findAll({ where: { Created_By: { [Op.ne]: created_by } } })
    
    return { List, myPendingList, pendingList }
  }

  async pendingDormantAction(reqbody) {
          
    let Operation = 'REJECTED'
    let dormaninfo
    let createBody = {}
   

    //action_id = 1=> approve, action_id = 2=> reject, action_id = 3 => delete
    const { action_id = 2, Row_Id, reject_msg = null, Created_By } = reqbody

    Operation = (action_id == 1) ? 'APPROVED' : (action_id == 2) ? 'REJECTED' : 'DELETE'


    dormaninfo = await this.dormantTempRepo.findOne({ where: { Row_Id } })

    if (!dormaninfo) {

      throw new NotFoundException()
    }

    if (dormaninfo['dataValues']['Created_By'] == Created_By && (action_id == 1 || action_id == 2)) {

      throw new BadRequestException('You cannot Approve/Reject it')
    }

    const { Wallet_Type, Dormant_Inactive_Days, Main_Row_Id, Operation: old_action, Created_By: old_created_by } = dormaninfo['dataValues']
     



    if (old_action == 'INSERT') {

      const createData = {
        Wallet_Type,
        Dormant_Inactive_Days,
        Created_By: old_created_by,
        Approved_By: Created_By,
        Operation: `${Operation}-${old_action}`
      }
      if (action_id == 1) {

        this.dormantHistoryRepo.create(createData)
  
        const createdinfo = await this.dormantRepo.create(createData)
            
        await this.dormantTempRepo.destroy({ where: { Row_Id } })
  
      }
      else {

        this.dormantHistoryRepo.create(createData)
        this.dormantTempRepo.destroy({ where: { Row_Id } })
      }
  
    }
    else if (old_action == 'UPDATE') {

      const createData = {
        Wallet_Type,
        Dormant_Inactive_Days,
        Created_By: old_created_by,
        Approved_By: Created_By,
        Operation: `${Operation}-${old_action}`
               
      }
      if (action_id == 1) {

        this.dormantHistoryRepo.create(createData)
  
        const update = await this.dormantRepo.update(createData, { where: { Row_Id: Main_Row_Id }, returning: true })

      
        //distroy...
        await this.dormantTempRepo.destroy({ where: { Row_Id } })

      }
      else {

        this.dormantHistoryRepo.create(createData)
        await this.dormantTempRepo.destroy({ where: { Row_Id } })
      }
  
    }
    else if (old_action == 'DELETE') {

      const createData = {
        Wallet_Type,
        Dormant_Inactive_Days,
        Created_By: old_created_by,
        Approved_By: Created_By,
        Operation: `${Operation}-${old_action}`
             
      }
      if (action_id == 1) {

        this.dormantHistoryRepo.create(createData)
  
        const createdinfo = await this.dormantRepo.findOne({ where: { Row_Id: Main_Row_Id } })

        if (createdinfo) {

          await this.dormantRepo.destroy({ where: { Row_Id: Main_Row_Id } })
                 
        }

        //distroy...
        this.dormantTempRepo.destroy({ where: { Row_Id } })
              

      }
      else {

        this.dormantHistoryRepo.create(createData)
        this.dormantTempRepo.destroy({ where: { Row_Id } })
      }
  
    }

    return true

  }

  async userDetails(reqbody) {


    const { Msisdn } = reqbody

    const result = JSON.parse(
      JSON.stringify(
        await this.DB.query(
          `exec SW_PROC_GET_USER_DETAILS
        @Msisdn = ${Msisdn}
      `
        )))
    const arrayResult = result[0][0]
    
    const response = {
      Name: arrayResult.Name,
      Wallet_Details: arrayResult.Wallet_Details,
      MSISDN:arrayResult.MSISDN
    }
    
    return response

  }

}
