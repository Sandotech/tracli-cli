import { Clock } from '@ports/Clock';
import { CurrentUserProvider } from '@ports/CurrentUserProvider';
import { SyncGateway } from '@ports/SyncGateway';
import { WorkLogRepository } from '@ports/WorkLogRepository';

export type SyncWorkLogsOutput = {
  pushedEntries: number;
};

export class SyncWorkLogsUseCase {
  constructor(
    private readonly deps: {
      workLogRepository: WorkLogRepository;
      currentUserProvider: CurrentUserProvider;
      clock: Clock;
      syncGateway: SyncGateway;
    },
  ) {}

  async execute(): Promise<SyncWorkLogsOutput> {
    const userId = await this.deps.currentUserProvider.getCurrentUserId();
    const unsynced = await this.deps.workLogRepository.listUnsynced({ userId });

    if (unsynced.length === 0) {
      return { pushedEntries: 0 };
    }

    await this.deps.syncGateway.pushWorkLogs(unsynced.map((e) => e.toPrimitives()));

    await this.deps.workLogRepository.markSynced({
      entryIds: unsynced.map((e) => e.id.value),
      syncedAt: this.deps.clock.now(),
    });

    return { pushedEntries: unsynced.length };
  }
}
