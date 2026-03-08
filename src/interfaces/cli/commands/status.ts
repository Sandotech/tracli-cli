import { Command } from 'commander';
import Table from 'cli-table3';
import { DomainError } from '@common/DomainError';
import { CliContainer } from '@interfaces/cli/CliContainer';

function formatHours(value: number): string {
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

export function registerStatusCommand(program: Command, container: CliContainer): void {
  program
    .command('status')
    .description('Show a weekly summary in an ASCII table')
    .action(async () => {
      try {
        const status = await container.getWeeklyStatus.execute();

        const table = new Table({
          head: ['Day', 'Date', 'Hours'],
        });

        for (const day of status.days) {
          table.push([day.weekday, day.date, formatHours(day.totalHours)]);
        }

        console.log(table.toString());
        console.log(`Total: ${formatHours(status.totalHours)}h`);
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
