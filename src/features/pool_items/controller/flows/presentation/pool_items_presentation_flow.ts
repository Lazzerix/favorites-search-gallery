import { PoolItem } from "../../../types/pool_item/pool_item";
import { PoolItemsInfiniteScrollFlow } from "./pool_items_infinite_scroll_flow";
import { PoolItemsPaginationFlow } from "./pool_items_pagination_flow";
import { PoolItemsPresentationFlow } from "../../../types/pool_items_presentation_flow_interface";
import { Preferences } from "../../../../../lib/global/preferences/preferences";

function getPresentationFlow(): PoolItemsPresentationFlow {
  return Preferences.infiniteScrollEnabled.value ? PoolItemsInfiniteScrollFlow : PoolItemsPaginationFlow;
}

export function present(poolItems: PoolItem[]): void {
  getPresentationFlow().present(poolItems);
}

export function clear(): void {
  getPresentationFlow().present([]);
}

export function revealFavorite(id: string): void {
  getPresentationFlow().revealFavorite(id);
}

export function handleNewSearchResults(): void {
  getPresentationFlow().handleNewSearchResults();
}
