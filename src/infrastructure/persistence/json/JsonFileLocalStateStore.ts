import { JsonFileStore } from './JsonFileStore';
import { LocalStateV1, defaultLocalState } from './localStateTypes';

export class JsonFileLocalStateStore {
  private readonly store: JsonFileStore;

  constructor(private readonly filePath: string) {
    this.store = new JsonFileStore(filePath);
  }

  async read(): Promise<LocalStateV1> {
    return this.store.readJson<LocalStateV1>(defaultLocalState());
  }

  async write(state: LocalStateV1): Promise<void> {
    return this.store.writeJson(state);
  }

  async update(mutator: (state: LocalStateV1) => void): Promise<LocalStateV1> {
    const state = await this.read();
    mutator(state);
    await this.write(state);
    return state;
  }

  getPath(): string {
    return this.filePath;
  }
}
