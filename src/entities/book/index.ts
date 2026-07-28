export { BookCard, type BookCardProps } from "@/entities/book/book-card";
export {
  mapBookDetailResponseDtoToDetail,
  mapBookDtoToDetail,
  mapBookDtoToSummary,
  mapBooksCollectionDtoToSummaries,
  omitUnsupportedBookFields,
} from "@/entities/book/mapper";
export type {
  BookDetail,
  BookPresentation,
  BookPresentationOptions,
  BookSummary,
} from "@/entities/book/model";
export { mapBookSummaryToPresentation } from "@/entities/book/presentation";