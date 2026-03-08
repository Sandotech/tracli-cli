import { UserId } from '@workLog/UserId';

export interface CurrentUserProvider {
  getCurrentUserId(): Promise<UserId>;
}
