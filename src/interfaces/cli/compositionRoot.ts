import { GetWeeklyStatusUseCase } from '@usecases/GetWeeklyStatusUseCase';
import { SyncWorkLogsUseCase } from '@usecases/SyncWorkLogsUseCase';
import { TrackWorkUseCase } from '@usecases/TrackWorkUseCase';
import { CryptoIdGenerator } from '@infrastructure/id/CryptoIdGenerator';
import { resolveDefaultLocalStateFilePath } from '@infrastructure/persistence/resolveDefaultLocalStateFilePath';
import { JsonFileCurrentUserProvider } from '@infrastructure/persistence/json/JsonFileCurrentUserProvider';
import { JsonFileLocalStateStore } from '@infrastructure/persistence/json/JsonFileLocalStateStore';
import { JsonFileWorkLogRepository } from '@infrastructure/persistence/json/JsonFileWorkLogRepository';
import { HttpSyncGateway } from '@infrastructure/sync/HttpSyncGateway';
import { SystemClock } from '@infrastructure/time/SystemClock';
import { CliContainer } from './CliContainer';

export function buildCliContainer(): CliContainer {
  const stateFilePath = resolveDefaultLocalStateFilePath();
  const stateStore = new JsonFileLocalStateStore(stateFilePath);

  const workLogRepository = new JsonFileWorkLogRepository(stateStore);
  const currentUserProvider = new JsonFileCurrentUserProvider(stateStore);
  const clock = new SystemClock();
  const idGenerator = new CryptoIdGenerator();

  const apiBaseUrl = process.env.TRACLI_API_BASE_URL?.trim() || 'http://localhost:3000';
  const syncGateway = new HttpSyncGateway({
    baseUrl: apiBaseUrl,
    path: '/api/v1/logs',
  });

  return {
    trackWork: new TrackWorkUseCase({
      workLogRepository,
      currentUserProvider,
      clock,
      idGenerator,
    }),
    getWeeklyStatus: new GetWeeklyStatusUseCase({
      workLogRepository,
      currentUserProvider,
      clock,
    }),
    syncWorkLogs: new SyncWorkLogsUseCase({
      workLogRepository,
      currentUserProvider,
      clock,
      syncGateway,
    }),
  };
}
