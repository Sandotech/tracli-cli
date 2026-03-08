import { WorkLogEntryPrimitives } from '@workLog/WorkLogEntry';

export interface SyncGateway {
  pushWorkLogs(entries: WorkLogEntryPrimitives[]): Promise<void>;
}
