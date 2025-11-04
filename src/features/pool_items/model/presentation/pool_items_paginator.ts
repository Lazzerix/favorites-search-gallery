import { PoolItem } from "../../types/pool_item/pool_item";
import { PoolItemsPageRelation } from "../../types/pool_item/pool_items_types";
import { PoolItemsPaginationParameters } from "../../types/pool_items_pagination_parameters";
import { NavigationKey } from "../../../../types/common_types";
import { Preferences } from "../../../../lib/global/preferences/preferences";
import { clamp } from "../../../../utils/primitive/number";
import { isForwardNavigationKey } from "../../../../types/equivalence";

let currentPageNumber = 1;
let resultsPerPage = Preferences.resultsPerPage.value;
let poolItems: PoolItem[] = [];

function getPageCount(): number {
  const favoriteCount = poolItems.length;

  if (favoriteCount === 0) {
    return 1;
  }
  const pageCount = favoriteCount / resultsPerPage;

  if (favoriteCount % resultsPerPage === 0) {
    return pageCount;
  }
  return Math.floor(pageCount) + 1;
}

export function onFirstPage(): boolean {
  return currentPageNumber === 1;
}

export function onFinalPage(): boolean {
  return currentPageNumber === getPageCount();
}

export function onlyOnePage(): boolean {
  return onFirstPage() && onFinalPage();
}

export function getPaginationParameters(): PoolItemsPaginationParameters {
  const { start, end } = getCurrentPageRange();
  return { currentPageNumber, finalPageNumber: getPageCount(), poolItemsCount: poolItems.length, startIndex: start, endIndex: end };
}

export function paginate(newPoolItems: PoolItem[]): void {
  poolItems = newPoolItems;
}

export function changePage(pageNumber: number): void {
  currentPageNumber = clamp(pageNumber, 1, getPageCount());
}

export function gotoFirstPage(): void {
  changePage(1);
}

function gotoLastPage(): void {
  changePage(getPageCount());
}

export function getPoolItemsOnCurrentPage(): PoolItem[] {
  return getPoolItemsOnPage(currentPageNumber);
}

export function getPoolItemsOnNextPage(): PoolItem[] {
  return getPoolItemsOnPage(currentPageNumber + 1);
}

export function getPoolItemsOnPreviousPage(): PoolItem[] {
  return getPoolItemsOnPage(currentPageNumber - 1);
}

function getPoolItemsOnPage(pageNumber: number): PoolItem[] {
  const { start, end } = getPageRange(pageNumber);
  return poolItems.slice(start, end);
}

function getCurrentPageRange(): { start: number; end: number } {
  return getPageRange(currentPageNumber);
}

function getPageRange(pageNumber: number): { start: number; end: number } {
  return {
    start: resultsPerPage * (pageNumber - 1),
    end: resultsPerPage * pageNumber
  };
}

export function changeResultsPerPage(newResultsPerPage: number): void {
  resultsPerPage = newResultsPerPage;
}

export function gotoAdjacentPage(direction: NavigationKey): boolean {
  const forward = isForwardNavigationKey(direction);

  if (onlyOnePage()) {
    return false;
  }

  if (onFinalPage() && forward) {
    gotoFirstPage();
  } else if (onFirstPage() && !forward) {
    gotoLastPage();
  } else {
    changePage(forward ? currentPageNumber + 1 : currentPageNumber - 1);
  }
  return true;
}

export function gotoRelativePage(relation: PoolItemsPageRelation): boolean {
  if (onlyOnePage()) {
    return false;
  }

  switch (relation) {
    case "previous":
      if (onFirstPage()) {
        return false;
      }
      gotoAdjacentPage("ArrowLeft");
      return true;

    case "first":
      if (onFirstPage()) {
        return false;
      }
      gotoFirstPage();
      return true;

    case "next":
      if (onFinalPage()) {
        return false;
      }
      return gotoAdjacentPage("ArrowRight");

    case "final":
      if (onFinalPage()) {
        return false;
      }
      gotoLastPage();
      return true;

    default:
      return false;
  }
}

export function gotoPageWithFavorite(id: string): boolean {
  const favoriteIds = poolItems.map(favorite => favorite.id);
  const index = favoriteIds.indexOf(id);
  const favoriteNotFound = index === -1;

  if (favoriteNotFound) {
    return false;
  }
  const pageNumber = Math.floor(index / resultsPerPage) + 1;
  const favoriteOnDifferentPage = currentPageNumber !== pageNumber;

  if (favoriteOnDifferentPage) {
    changePage(pageNumber);
    return true;
  }
  return false;
}
