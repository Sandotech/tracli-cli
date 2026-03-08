import { randomUUID } from 'node:crypto';
import { CurrentUserProvider } from '@ports/CurrentUserProvider';
import { UserId } from '@workLog/UserId';
import { JsonFileLocalStateStore } from './JsonFileLocalStateStore';

export class JsonFileCurrentUserProvider implements CurrentUserProvider {
  constructor(private readonly stateStore: JsonFileLocalStateStore) {}

  async getCurrentUserId(): Promise<UserId> {
    const state = await this.stateStore.read();

    if (state.user?.id && state.user.id.trim().length > 0) {
      return UserId.create(state.user.id);
    }

    const newId = randomUUID();
    const nextState = await this.stateStore.update((s) => {
      s.user = { id: newId };
    });

    return UserId.create(nextState.user.id);
  }
}
