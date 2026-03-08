import { Command } from 'commander';
import { DomainError } from '@common/DomainError';
import { CliContainer } from '@interfaces/cli/CliContainer';

export function registerSyncCommand(program: Command, container: CliContainer): void {
  program
    .command('sync')
    .description('Push local logs to a central API')
    .action(async () => {
      try {
        const result = await container.syncWorkLogs.execute();

        if (result.pushedEntries === 0) {
          console.log('Nothing to sync.');
          return;
        }

        const word = result.pushedEntries === 1 ? 'entry' : 'entries';
        console.log(`Synced ${result.pushedEntries} ${word}.`);
      } catch (err: any) {
        if (err instanceof DomainError) {
          console.error(err.message);
          process.exitCode = 1;
          return;
        }

        console.error(err?.message || String(err));
        process.exitCode = 1;
      }
    });
}
