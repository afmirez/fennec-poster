import { NoteRecord } from "./notePayload";

export interface CategoryMaping {
  noteRecords: NoteRecord[];
  categoryId?: string;
}
