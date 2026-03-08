#!/usr/bin/env node

import { Command } from 'commander';
import { buildCliContainer } from './compositionRoot';
import { registerTrackCommand } from './commands/track';
import { registerStatusCommand } from './commands/status';
import { registerSyncCommand } from './commands/sync';

async function main(): Promise<void> {
  const container = buildCliContainer();

  const program = new Command();
  program.name('tracli').description('Zero-friction work logger for terminal-first developers.').version('0.1.0');

  registerTrackCommand(program, container);
  registerStatusCommand(program, container);
  registerSyncCommand(program, container);

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(err?.message || String(err));
  process.exitCode = 1;
});
