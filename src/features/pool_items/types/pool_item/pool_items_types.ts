import { PoolItem } from "./pool_item";

export interface FavoriteElement {
  root: HTMLElement
  container: HTMLAnchorElement
  image: HTMLImageElement
  favoriteButton: HTMLImageElement
  downloadButton: HTMLImageElement
  thumbURL: string
}

export type PoolItemsPageRelation = "first" | "previous" | "next" | "final";

export interface NewPoolItems {
  newPoolItems: PoolItem[]
  newSearchResults: PoolItem[]
  allSearchResults: PoolItem[]
}
