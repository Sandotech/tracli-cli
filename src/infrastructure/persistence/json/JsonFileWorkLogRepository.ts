import { WorkLogRepository } from '@ports/WorkLogRepository';
import { UserId } from '@workLog/UserId';
import { WorkLogEntry } from '@workLog/WorkLogEntry';
import { JsonFileLocalStateStore } from './JsonFileLocalStateStore';

export class JsonFileWorkLogRepository implements WorkLogRepository {
  constructor(private readonly stateStore: JsonFileLocalStateStore) {}

  async add(entry: WorkLogEntry): Promise<void> {
    await this.stateStore.update((state) => {
      state.entries.push(entry.toPrimitives());
    });
  }

  async listByUserAndDateRange(params: {
    userId: UserId;
    startInclusive: Date;
    endExclusive: Date;
  }): Promise<WorkLogEntry[]> {
    const state = await this.stateStore.read();

    const startMs = params.startInclusive.getTime();
    const endMs = params.endExclusive.getTime();

    return state.entries
      .filter((e) => e.userId === params.userId.value)
      .filter((e) => {
        const createdAtMs = new Date(e.createdAt).getTime();
        return createdAtMs >= startMs && createdAtMs < endMs;
      })
      .map((e) => WorkLogEntry.fromPrimitives(e));
  }

  async listUnsynced(params: { userId: UserId }): Promise<WorkLogEntry[]> {
    const state = await this.stateStore.read();

    return state.entries
      .filter((e) => e.userId === params.userId.value)
      .filter((e) => !e.syncedAt)
      .map((e) => WorkLogEntry.fromPrimitives(e));
  }

  async markSynced(params: { entryIds: string[]; syncedAt: Date }): Promise<void> {
    const ids = new Set(params.entryIds);
    const syncedAtIso = params.syncedAt.toISOString();

    await this.stateStore.update((state) => {
      state.entries = state.entries.map((e) => {
        if (!ids.has(e.id)) {
          return e;
        }
        return {
          ...e,
          syncedAt: syncedAtIso,
        };
      });
    });
  }
}
