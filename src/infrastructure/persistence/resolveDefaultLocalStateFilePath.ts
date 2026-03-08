import os from 'node:os';
import path from 'node:path';

export function resolveDefaultLocalStateFilePath(): string {
  if (process.env.TRACLI_STATE_FILE && process.env.TRACLI_STATE_FILE.trim().length > 0) {
    return process.env.TRACLI_STATE_FILE.trim();
  }

  return path.join(os.homedir(), '.tracli', 'state.json');
}
