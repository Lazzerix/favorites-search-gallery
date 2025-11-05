import * as InfiniteScrollFeeder from "./presentation/pool_items_infinite_scroll_feeder";
import * as PoolItemsLoader from "./load/pool_items_loader";
import * as PoolItemsMetadata from "../types/metadata/pool_items_metadata";
import * as PoolItemsPaginator from "./presentation/pool_items_paginator";
import * as PoolItemsSearchFilter from "./search/components/pool_items_search_filter";
import * as PoolItemsSorter from "./search/components/pool_items_sorter";
import { NavigationKey, Rating, SortingMethod } from "../../../types/common_types";
import { NewPoolItems, PoolItemsPageRelation } from "../types/pool_item/pool_items_types";
import {PoolItem, getPoolItem} from "../types/pool_item/pool_item";
import { CONTENT_CONTAINER } from "../../../lib/global/content/content_container";
import { ITEM_SELECTOR } from "../../../utils/dom/dom";
import { POOL_ITEMS_SEARCH_INDEX } from "./search/index/pool_items_search_index";
import { PoolItemsPaginationParameters } from "../types/pool_items_pagination_parameters";
import { shuffleArray } from "../../../utils/collection/array";

let latestSearchResults: PoolItem[] = [];

export async function loadAllPoolItemsFromDatabase(): Promise<PoolItem[]> {
  await PoolItemsLoader.loadAllPoolItemsFromDatabase();
  return getAllPoolItems().length === 0 ? [] : getSearchResults("");
}

export function fetchAllPoolItems(onSearchResultsFound: () => void): Promise<void> {
  const onPoolItemsFound = (poolItem: PoolItem[]): void => {
    latestSearchResults = latestSearchResults.concat(PoolItemsSearchFilter.filter(poolItem));
    return onSearchResultsFound();
  };
  return PoolItemsLoader.fetchAllPoolItems(onPoolItemsFound);
}

export async function fetchNewPoolItemsOnReload(): Promise<NewPoolItems> {
  const newPoolItems = await PoolItemsLoader.fetchNewPoolItemsOnReload();
  const newSearchResults = PoolItemsSearchFilter.filter(newPoolItems);

  latestSearchResults = newSearchResults.concat(latestSearchResults);
  return {
    newPoolItems,
    newSearchResults,
    allSearchResults: latestSearchResults
  };
}

export function storeNewPoolItems(newPoolItems: PoolItem[]): Promise<void> {
  return PoolItemsLoader.storeNewPoolItems(newPoolItems);
}

export function getAllPoolItems(): PoolItem[] {
  return PoolItemsLoader.getAllPoolItems();
}

export function storeAllPoolItems(): Promise<void> {
  return PoolItemsLoader.storeAllPoolItems();
}

export function getLatestSearchResults(): PoolItem[] {
  return latestSearchResults;
}

export function getSearchResults(searchQuery: string): PoolItem[] {
  PoolItemsSearchFilter.setSearchQuery(searchQuery);
  return getSearchResultsFromLatestQuery();
}

export function getSearchResultsFromLatestQuery(): PoolItem[] {
  const poolItems = PoolItemsSearchFilter.filter(getAllPoolItems());

  latestSearchResults = PoolItemsSorter.sortPoolItems(poolItems);
  return latestSearchResults;
}

export function getShuffledSearchResults(): PoolItem[] {
  return shuffleArray(latestSearchResults);
}

export function invertSearchResults(): void {
  const searchResultIds = new Set(latestSearchResults.map(favorite => favorite.id));
  const invertedSearchResults = getAllPoolItems().filter(favorite => !searchResultIds.has(favorite.id));
  const ratingFilteredInvertedSearchResults = PoolItemsSearchFilter.filterByRating(invertedSearchResults);

  latestSearchResults = PoolItemsSearchFilter.filterOutBlacklisted(ratingFilteredInvertedSearchResults);
}

export function paginate(searchResults: PoolItem[]): void {
  PoolItemsPaginator.paginate(searchResults);
}

export function changePage(pageNumber: number): void {
  PoolItemsPaginator.changePage(pageNumber);
}

export function getPoolItemsOnCurrentPage(): PoolItem[] {
  return PoolItemsPaginator.getPoolItemsOnCurrentPage();
}

export function getPoolItemsOnNextPage(): PoolItem[] {
  return PoolItemsPaginator.getPoolItemsOnNextPage();
}

export function getPoolItemsOnPreviousPage(): PoolItem[] {
  return PoolItemsPaginator.getPoolItemsOnPreviousPage();
}

export function gotoAdjacentPage(direction: NavigationKey): boolean {
  return PoolItemsPaginator.gotoAdjacentPage(direction);
}

export function gotoRelativePage(relation: PoolItemsPageRelation): boolean {
  return PoolItemsPaginator.gotoRelativePage(relation);
}

export function gotoPageWithFavoriteId(id: string): boolean {
  return PoolItemsPaginator.gotoPageWithFavorite(id);
}

export function getPaginationParameters(): PoolItemsPaginationParameters {
  return PoolItemsPaginator.getPaginationParameters();
}

export function onFinalPage(): boolean {
  return PoolItemsPaginator.onFinalPage();
}

export function toggleBlacklist(value: boolean): void {
  PoolItemsSearchFilter.toggleBlacklistFiltering(value);
}

export function changeAllowedRatings(allowedRatings: Rating): void {
  PoolItemsSearchFilter.setAllowedRatings(allowedRatings);
}

export function setSortingMethod(sortingMethod: SortingMethod): void {
  PoolItemsSorter.setSortingMethod(sortingMethod);
}

export function toggleSortAscending(value: boolean): void {
  PoolItemsSorter.setAscendingOrder(value);
}

export function updateMetadata(id: string): void {
  PoolItemsLoader.updateMetadata(id);
}

export function changeResultsPerPage(resultsPerPage: number): void {
  PoolItemsPaginator.changeResultsPerPage(resultsPerPage);
}

export function getMoreResults(): HTMLElement[] {
  return InfiniteScrollFeeder.getMoreResults(latestSearchResults);
}

export function getThumbURLsToPreload(): string[] {
  return InfiniteScrollFeeder.getThumbURLsToPreload(latestSearchResults);
}

export function getFirstResults(): PoolItem[] {
  return InfiniteScrollFeeder.getFirstResults(latestSearchResults);
}

export function deleteFavorite(id: string): Promise<void> {
  return PoolItemsLoader.deleteFavorite(id);
}

export function setSearchSubset(): void {
  PoolItemsLoader.setSearchSubset(latestSearchResults);
}

export function stopSearchSubset(): void {
  PoolItemsLoader.stopSearchSubset();
}

export function deleteDatabase(): void {
  PoolItemsLoader.deleteDatabase();
}

export function keepIndexedTagsSorted(): void {
  POOL_ITEMS_SEARCH_INDEX.keepIndexedTagsSorted(true);
}

export function buildSearchIndexAsynchronously(): void {
  POOL_ITEMS_SEARCH_INDEX.buildIndexAsynchronously();
}

export function buildSearchIndexSynchronously(): void {
  POOL_ITEMS_SEARCH_INDEX.buildIndexSynchronously();
}

export function noPoolItemsAreVisible(): boolean {
  return CONTENT_CONTAINER.querySelector(ITEM_SELECTOR) === null;
}

export function updateMissingMetadata(): Promise<void> {
  return PoolItemsMetadata.updateMissingMetadata();
}

export function onStartedStoringPoolItems(): void {
  PoolItemsMetadata.onStartedStoringAllPoolItems();
}

export function swapFavoriteButton(id: string): void {
  getPoolItem(id)?.swapPoolItemButton();
}

export function resetTagModifications(): void {
  getAllPoolItems().forEach(favorite => {
    favorite.resetAdditionalTags();
  });
}
