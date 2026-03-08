import { GetWeeklyStatusUseCase } from '@usecases/GetWeeklyStatusUseCase';
import { SyncWorkLogsUseCase } from '@usecases/SyncWorkLogsUseCase';
import { TrackWorkUseCase } from '@usecases/TrackWorkUseCase';

export type CliContainer = {
  trackWork: TrackWorkUseCase;
  getWeeklyStatus: GetWeeklyStatusUseCase;
  syncWorkLogs: SyncWorkLogsUseCase;
};
