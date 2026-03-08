declare module 'cli-table3' {
  export type TableCell = string | number | boolean | null | undefined;

  export interface TableOptions {
    head?: TableCell[];
    colWidths?: number[];
    style?: Record<string, unknown>;
  }

  export default class Table {
    constructor(options?: TableOptions);
    push(...rows: TableCell[][]): number;
    toString(): string;
  }
}
