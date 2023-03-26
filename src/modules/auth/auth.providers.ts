import { JsonrxModel } from '../../models';
import { USER_REPOSITORY } from '../../config/constants';

export const authProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: JsonrxModel,
  },
];
