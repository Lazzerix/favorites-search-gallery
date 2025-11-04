import { MetadataMetric, Post, Rating, Searchable } from "./common_types";

export type PoolItemMetricMap = {
  [key in MetadataMetric]: number
}

export type PoolItemsMetadataDatabaseRecord = {
  width: number
  height: number
  score: number
  rating: number
  create: number
  change: number
  duration: number | undefined
  deleted: boolean
};

export type PoolItemsDatabaseRecord = {
  id: string;
  tags: Set<string>;
  src: string;
  metadata: PoolItemsMetadataDatabaseRecord;
};

export interface PoolItemRaw extends Searchable {
  id: string
  root: HTMLElement
  thumbURL: string
  databaseRecord: PoolItemsDatabaseRecord
  withinRating: (rating: Rating) => boolean
  swapPoolItemButton: () => void
  validateTags: (post: Post) => void
  addAdditionalTags: (newTags: string) => string
  removeAdditionalTags: (tagsToRemove: string) => string
  resetAdditionalTags: () => void
  metrics: PoolItemMetricMap
}

export enum AddPoolItemStatus {
  ERROR = 0,
  ALREADY_ADDED = 1,
  NOT_LOGGED_IN = 2,
  SUCCESSFULLY_ADDED = 3
}

export enum RemovePoolItemStatus {
  ERROR = 0,
  FORBIDDEN = 1,
  SUCCESSFULLY_REMOVED = 2
}
