import { LogModel } from '../../models';
import { LOG_REPOSITORY } from '../../config/constants';

export const userProviders = [
  {
    provide: LOG_REPOSITORY,
    useValue: LogModel,
  },
];
