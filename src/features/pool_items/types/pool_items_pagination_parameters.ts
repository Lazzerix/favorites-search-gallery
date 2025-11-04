export type PoolItemsPaginationParameters = {
  currentPageNumber: number
  finalPageNumber: number
  poolItemsCount: number
  startIndex: number
  endIndex: number
};

export const EMPTY_POOL_ITEMS_PAGINATION_PARAMETERS = {
  currentPageNumber: 1,
  finalPageNumber: 1,
  poolItemsCount: 0,
  startIndex: 0,
  endIndex: 0
};
