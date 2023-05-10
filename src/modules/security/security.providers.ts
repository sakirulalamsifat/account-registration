import {
  SecurityQuestionHistoryModel,
  SecurityQuestionModel,
  SecurityQuestionTempModel,
  SecurityQuestionAnswerModel,
  CustomerProfileModel,
  AgentPorfileModel,
  MerchantProfileModel,
  NotificationModel,
  
} from '../../models';
import {
  SW_TBL_SECURITY_QUESTION,
  SW_TBL_SECURITY_QUESTION_HISTORY,
  SW_TBL_SECURITY_QUESTION_TEMP,
  SW_TBL_SECURITY_QUESTION_ANSWER_SET,
  SW_TBL_PROFILE_AGENTS,
  SW_TBL_PROFILE_CUST,
  SW_TBL_PROFILE_MERCHANT,
  NOTIFICATION_REPOSITORY
} from '../../config/constants';

export const securityProviders = [
  {
    provide: SW_TBL_SECURITY_QUESTION,
    useValue: SecurityQuestionModel,
  },
  {
    provide: SW_TBL_SECURITY_QUESTION_HISTORY,
    useValue: SecurityQuestionHistoryModel,
  },

  {
    provide: SW_TBL_SECURITY_QUESTION_TEMP,
    useValue: SecurityQuestionTempModel,
  },
  {
    provide: SW_TBL_SECURITY_QUESTION_ANSWER_SET,
    useValue: SecurityQuestionAnswerModel,
  },
  {
    provide: SW_TBL_PROFILE_AGENTS,
    useValue: AgentPorfileModel,
  },
  {
    provide: SW_TBL_PROFILE_CUST,
    useValue: CustomerProfileModel,
  },
  {
    provide: SW_TBL_PROFILE_MERCHANT,
    useValue: MerchantProfileModel,
  },
  {
    provide: NOTIFICATION_REPOSITORY,
    useValue: NotificationModel,
  }
];
