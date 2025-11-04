import * as ContentTiler from "../../../lib/global/content/tilers/tiler";
import * as PoolItemsPaginationMenu from "./menu/pool_items_pagination_menu";
import * as PoolItemsPreloader from "../../../utils/dom/thumb_preloader";
import * as PoolItemsStatus from "./menu/pool_items_status_bar";
import { scrollToTop, waitForAllThumbnailsToLoad } from "../../../utils/dom/dom";
import { toggleAddOrRemoveButtons, toggleDownloadButtons } from "../../../utils/dom/ui_element";
import { Favorite } from "../../../types/favorite_types";
import { GeneralSettings } from "../../../config/general_settings";
import { Layout } from "../../../types/common_types";
import { PoolItem } from "../types/pool_item/pool_item";
import { PoolItemRaw } from "../../../types/pool_item_types";
import { PoolItemsPaginationParameters } from "../types/pool_items_pagination_parameters";
import { Preferences } from "../../../lib/global/preferences/preferences";
import { USER_IS_ON_THEIR_OWN_POOL_PAGE } from "../../../lib/global/flags/intrinsic_flags";
import { collectAspectRatios } from "../../../lib/global/content/skeleton/aspect_ratio_collector";
import { createPoolItemHTMLTemplates } from "../types/pool_item/pool_items_element";
import { hideUnusedLayoutSizer } from "../../../lib/global/content/tilers/tiler_event_handlers";
import { sleep } from "../../../utils/misc/async";

export function setStatus(message: string): void {
  PoolItemsStatus.setStatus(message);
}

export function setTemporaryStatus(message: string): void {
  PoolItemsStatus.setTemporaryStatus(message);
}

export function updateStatusWhileFetching(searchResultCount: number, totalPoolItemsCount: number): void {
  PoolItemsStatus.updateStatusWhileFetching(searchResultCount, totalPoolItemsCount);
}

export function insertNewSearchResults(thumbs: HTMLElement[]): void {
  ContentTiler.addItemsToBottom(thumbs);
}

export function insertNewSearchResultsOnReload(results: { newSearchResults: PoolItemRaw[], newPoolItems: PoolItemRaw[], allSearchResults: PoolItemRaw[] }): void {
  ContentTiler.addItemsToTop(results.newSearchResults.map((favorite) => favorite.root));
  PoolItemsStatus.notifyNewPoolItemsFound(results.newPoolItems.length);
}

export function changeLayout(layout: Layout): void {
  ContentTiler.changeLayout(layout);
}

export function showSearchResults(searchResults: PoolItemRaw[]): void {
  ContentTiler.tile(searchResults.map((result) => result.root));
  scrollToTop();
}

export function clear(): void {
  showSearchResults([]);
}

export function setMatchCount(matchCount: number): void {
  PoolItemsStatus.setMatchCount(matchCount);
}

export function createPageSelectionMenu(parameters: PoolItemsPaginationParameters): void {
  PoolItemsPaginationMenu.create(parameters);
}

export function createPageSelectionMenuWhileFetching(parameters : PoolItemsPaginationParameters): void {
  PoolItemsPaginationMenu.update(parameters);
}

export async function revealFavorite(id: string) : Promise<void> {
  await waitForAllThumbnailsToLoad();
  const thumb = document.getElementById(id);

  if (thumb === null || thumb.classList.contains("blink")) {
    return;
  }
  thumb.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  thumb.classList.add("blink");
  await sleep(1500);
  thumb.classList.remove("blink");
}

export function getPaginationMenu(): HTMLElement {
  return PoolItemsPaginationMenu.getContainer();
}

export function togglePaginationMenu(value: boolean): void {
  PoolItemsPaginationMenu.toggle(value);
}

export function setupPoolItemsView(): void {
    createPoolItemHTMLTemplates();
    collectAspectRatios();
    PoolItemsStatus.setupPoolItemsStatus();
    ContentTiler.setupTiler();
    ContentTiler.showSkeleton();
    hideUnusedLayoutSizer(Preferences.poolItemsLayout.value);
    PoolItemsPaginationMenu.setupPoolItemsPaginationMenu();
    toggleAddOrRemoveButtons(USER_IS_ON_THEIR_OWN_POOL_PAGE ? Preferences.removeButtonsVisible.value : Preferences.addButtonsVisible.value);
    toggleDownloadButtons(Preferences.downloadButtonsVisible.value);
}

export function preloadThumbnails(poolItems: PoolItem[]): void {
  if (GeneralSettings.preloadThumbnails) {
    PoolItemsPreloader.preloadThumbnailsPoolItem(poolItems);
  }
}

export function preloadURLs(urls: string[]): void {
  if (GeneralSettings.preloadThumbnails) {
    PoolItemsPreloader.preloadImages(urls);
  }
}

export function getCurrentLayout(): Layout {
  return ContentTiler.getCurrentLayout();
}
