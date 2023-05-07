import {
  AgentModel,
  AgentPorfileModel,
  JsonrxModel,
  WalletModel,
  NotificationModel,
  TransactionModel,
  LogModel,
} from '../../models';
import {
  AGENTPROFILE_REPOSITORY,
  TRANSACTION_REPOSITORY,
  JSONRX_REPOSITORY,
  WALLET_REPOSITORY,
  NOTIFICATION_REPOSITORY,
  TOPFIVE_REPOSITORY,
  LOG_REPOSITORY,
} from '../../config/constants';

export const userProviders = [
  {
    provide: AGENTPROFILE_REPOSITORY,
    useValue: AgentPorfileModel,
  },
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: AgentModel,
  },

  {
    provide: JSONRX_REPOSITORY,
    useValue: JsonrxModel,
  },
  {
    provide: WALLET_REPOSITORY,
    useValue: WalletModel,
  },
  {
    provide: NOTIFICATION_REPOSITORY,
    useValue: NotificationModel,
  },
  {
    provide: TOPFIVE_REPOSITORY,
    useValue: TransactionModel,
  },
  {
    provide: LOG_REPOSITORY,
    useValue: LogModel,
  },
];
