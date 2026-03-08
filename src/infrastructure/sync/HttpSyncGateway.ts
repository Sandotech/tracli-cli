import { SyncGateway } from '@ports/SyncGateway';
import { WorkLogEntryPrimitives } from '@workLog/WorkLogEntry';

export class HttpSyncGateway implements SyncGateway {
  constructor(
    private readonly config: {
      baseUrl: string;
      path: string;
    },
  ) {}

  async pushWorkLogs(entries: WorkLogEntryPrimitives[]): Promise<void> {
    const base = this.config.baseUrl.replace(/\/$/, '');
    const url = `${base}${this.config.path}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ entries }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Sync failed (${res.status}): ${text || res.statusText}`);
    }
  }
}
