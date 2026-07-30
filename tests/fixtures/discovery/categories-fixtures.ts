export const discoveryCategoryDtoFixture = Object.freeze({
  id: 7,
  name: "Science Fiction",
});

export const discoverySecondaryCategoryDtoFixture = Object.freeze({
  id: 8,
  name: "History",
});

export const discoveryTertiaryCategoryDtoFixture = Object.freeze({
  id: 9,
  name: "Personal Growth",
});

export const discoveryQuaternaryCategoryDtoFixture = Object.freeze({
  id: 10,
  name: "Philosophy",
});

export const invalidCategoryDtoFixture = Object.freeze({
  name: "Missing id should be ignored by the mapper.",
});

export const homeCategoriesCollectionFixture = Object.freeze({
  categories: [
    discoveryCategoryDtoFixture,
    discoverySecondaryCategoryDtoFixture,
    discoveryTertiaryCategoryDtoFixture,
    discoveryQuaternaryCategoryDtoFixture,
  ],
});

export const emptyHomeCategoriesCollectionFixture = Object.freeze({
  categories: [],
});

export const discoveryCategoriesCollectionFixture = Object.freeze({
  categories: [discoveryCategoryDtoFixture, discoverySecondaryCategoryDtoFixture],
});

export const discoveryCategoriesPartialCollectionFixture = Object.freeze({
  data: [discoveryCategoryDtoFixture, invalidCategoryDtoFixture],
  meta: {
    page: 1,
    limit: 20,
    total: 2,
    totalPages: 1,
    hasMore: false,
  },
});