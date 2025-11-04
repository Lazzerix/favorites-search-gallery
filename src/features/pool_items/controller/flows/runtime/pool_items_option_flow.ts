import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsSearchFlow from "./pool_items_search_flow";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Layout, Rating, SortingMethod } from "../../../../../types/common_types";
import { PoolItemsInfiniteScrollFlow } from "../presentation/pool_items_infinite_scroll_flow";

export function changeLayout(layout: Layout): void {
  PoolItemsView.changeLayout(layout);
}

export function toggleInfiniteScroll(value: boolean): void {
  PoolItemsInfiniteScrollFlow.reset();
  PoolItemsView.togglePaginationMenu(!value);
  PoolItemsSearchFlow.showLatestSearchResults();
}

export function toggleBlacklist(value: boolean): void {
  PoolItemsModel.toggleBlacklist(value);
  PoolItemsSearchFlow.searchPoolItemsUsingLatestQuery();
}

export function changeSortingMethod(sortingMethod: SortingMethod): void {
  PoolItemsModel.setSortingMethod(sortingMethod);
  PoolItemsSearchFlow.searchPoolItemsUsingLatestQuery();
}

export function toggleSortAscending(value: boolean): void {
  PoolItemsModel.toggleSortAscending(value);
  PoolItemsSearchFlow.searchPoolItemsUsingLatestQuery();
}

export function changeAllowedRatings(ratings: Rating): void {
  PoolItemsModel.changeAllowedRatings(ratings);
  PoolItemsSearchFlow.searchPoolItemsUsingLatestQuery();
}

export function changeResultsPerPage(resultsPerPage: number): void {
  PoolItemsModel.changeResultsPerPage(resultsPerPage);
  PoolItemsSearchFlow.showLatestSearchResults();
}
