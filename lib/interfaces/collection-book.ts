import type { Book } from "./book";
import type { BookOverview } from "./book";

/** GET /collections/{id}/books — item trong danh sách */
export interface CollectionBook {
  id: string;
  bookId: string;
  collectionId: string;
  position: number;
  book: Book;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /collections/{id}/books — item trong danh sách (overview dto) */
export interface CollectionBookOverview {
  id: string;
  collectionId: string;
  position: number;
  collectionName?: string;
  book: BookOverview;
}
