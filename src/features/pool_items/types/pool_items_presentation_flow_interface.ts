import { Layout, NavigationKey } from "../../../types/common_types";
import { PoolItem } from "./pool_item/pool_item";

export interface PoolItemsPresentationFlow {
  present: (results: PoolItem[]) => void
  onLayoutChanged: (layout: Layout) => void
  revealFavorite: (id: string) => void
  reset: () => void
  handleNewSearchResults: () => void
  handlePageChangeRequest: (direction: NavigationKey) => void
}
