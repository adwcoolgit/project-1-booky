export { AuthorCard, type AuthorCardProps } from "@/entities/author/author-card";
export {
  mapAuthorBooksResponseDtoToCollection,
  mapAuthorDtoToSummary,
  mapAuthorsCollectionDtoToSummaries,
} from "@/entities/author/mapper";
export type {
  AuthorBookCollection,
  AuthorPresentation,
  AuthorPresentationOptions,
  PopularAuthorSummary,
} from "@/entities/author/model";
export { mapAuthorSummaryToPresentation } from "@/entities/author/presentation";