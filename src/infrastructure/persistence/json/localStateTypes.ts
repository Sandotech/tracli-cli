import { WorkLogEntryPrimitives } from '@workLog/WorkLogEntry';

export type LocalStateV1 = {
  version: 1;
  user: {
    id: string;
  };
  entries: WorkLogEntryPrimitives[];
};

export function defaultLocalState(): LocalStateV1 {
  return {
    version: 1,
    user: { id: '' },
    entries: [],
  };
}
