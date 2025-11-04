import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsPresentationFlow from "../presentation/pool_items_presentation_flow";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Events } from "../../../../../lib/global/events/events";
import { PoolItem } from "../../../types/pool_item/pool_item";

export function showSearchResults(searchResults: PoolItem[]): void {
  Events.poolItems.searchResultsUpdated.emit(searchResults);
  PoolItemsView.setMatchCount(searchResults.length);
  PoolItemsPresentationFlow.present(searchResults);
}

export function searchPoolItems(searchQuery: string): void {
  showSearchResults(PoolItemsModel.getSearchResults(searchQuery));
}

export function searchPoolItemsUsingLatestQuery(): void {
  showSearchResults(PoolItemsModel.getSearchResultsFromLatestQuery());
}

export function showLatestSearchResults(): void {
  showSearchResults(PoolItemsModel.getLatestSearchResults());
}

export function showAllPoolItems(): void {
  searchPoolItems("");
}

export function shuffleSearchResults(): void {
  showSearchResults(PoolItemsModel.getShuffledSearchResults());
}

export function invertSearchResults(): void {
  PoolItemsModel.invertSearchResults();
  showLatestSearchResults();
}

export function findFavoriteInAll(id: string): void {
  showAllPoolItems();
  PoolItemsPresentationFlow.revealFavorite(id);
}
