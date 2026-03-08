import { Command } from 'commander';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { DomainError } from '../../../domain/common/DomainError';
import { CliContainer } from '../CliContainer';

function formatHours(value: number): string {
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

async function promptHoursWorked(rl: ReturnType<typeof createInterface>): Promise<number> {
  // Guided prompt with validation.
  // Note: keep asking until valid.
  while (true) {
    const raw = await rl.question('Hours worked (0.5–12): ');
    const value = Number.parseFloat(raw);

    if (!Number.isFinite(value)) {
      console.log('Enter a valid number.');
      continue;
    }

    if (value < 0.5 || value > 12) {
      console.log('Hours must be between 0.5 and 12.');
      continue;
    }

    return value;
  }
}

async function promptRequiredText(rl: ReturnType<typeof createInterface>, message: string): Promise<string> {
  while (true) {
    const raw = await rl.question(message);
    const value = raw.trim();
    if (value.length === 0) {
      console.log('Description is required.');
      continue;
    }
    return raw;
  }
}

export function registerTrackCommand(program: Command, container: CliContainer): void {
  program
    .command('track')
    .description('Log work hours with guided prompts')
    .action(async () => {
      try {
        const rl = createInterface({ input, output });
        try {
          const hoursWorked = await promptHoursWorked(rl);
          const ticketIdRaw = await rl.question('Ticket/PBI (Enter to skip): ');
          const description = await promptRequiredText(rl, 'Description: ');

          const ticketId = ticketIdRaw.trim().length > 0 ? ticketIdRaw.trim() : undefined;

          const result = await container.trackWork.execute({
            hoursWorked,
            ticketId,
            description,
          });

          const hoursText = formatHours(hoursWorked);
          const totalTodayText = formatHours(result.totalTodayHours);

          if (ticketId) {
            // Mirrors the README example interaction.
            console.log(`Success! ${hoursText} hours logged to ${ticketId}. (Total today: ${totalTodayText}h)`);
          } else {
            console.log(`Success! ${hoursText} hours logged. (Total today: ${totalTodayText}h)`);
          }
        } finally {
          rl.close();
        }
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
