import { UserId } from '@workLog/UserId';
import { WorkLogEntry } from '@workLog/WorkLogEntry';

export interface WorkLogRepository {
  add(entry: WorkLogEntry): Promise<void>;

  listByUserAndDateRange(params: {
    userId: UserId;
    startInclusive: Date;
    endExclusive: Date;
  }): Promise<WorkLogEntry[]>;

  listUnsynced(params: { userId: UserId }): Promise<WorkLogEntry[]>;

  markSynced(params: { entryIds: string[]; syncedAt: Date }): Promise<void>;
}
