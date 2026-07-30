export { BookCard, type BookCardProps } from "@/entities/book/book-card";
export {
  mapBookDetailResponseDtoToDetail,
  mapBookDtoToDetail,
  mapBookDtoToSummary,
  mapBooksCollectionDtoToPage,
  mapBooksCollectionDtoToSummaries,
  omitUnsupportedBookFields,
} from "@/entities/book/mapper";
export type {
  BookAvailabilityState,
  BookDetail,
  BookDetailPresentation,
  BookPresentation,
  BookPresentationOptions,
  BookSummary,
  BookSummaryPage,
} from "@/entities/book/model";
export {
  mapBookDetailToPresentation,
  mapBookSummaryToPresentation,
} from "@/entities/book/presentation";