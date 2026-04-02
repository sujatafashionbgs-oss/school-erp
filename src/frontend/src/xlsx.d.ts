declare module "xlsx" {
  interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  type WorkSheet = Record<string, unknown>;
  export function read(data: unknown, opts?: unknown): WorkBook;
  export const utils: {
    sheet_to_json: <T = unknown>(sheet: WorkSheet, opts?: unknown) => T[];
    book_new: () => WorkBook;
    book_append_sheet: (wb: WorkBook, ws: WorkSheet, name?: string) => void;
    aoa_to_sheet: (data: unknown[][]) => WorkSheet;
  };
  export function writeFile(wb: WorkBook, filename: string): void;
}
