import { randomUUID } from 'node:crypto';
import { IdGenerator } from '@ports/IdGenerator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
