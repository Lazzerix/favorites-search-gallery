import { PoolItem } from "../../types/pool_item/pool_item";
import { PoolItemsSettings } from "../../../../config/pool_items_settings";

export function getMoreResults(poolItems: PoolItem[]): HTMLElement[] {
  const result = [];

  for (const favorite of poolItems) {
    if (document.getElementById(favorite.id) === null) {
      result.push(favorite.root);
    }

    if (result.length >= PoolItemsSettings.infiniteScrollBatchSize) {
      break;
    }
  }
  return result;
}

export function getFirstResults(poolItems: PoolItem[]): PoolItem[] {
  return poolItems.slice(0, PoolItemsSettings.infiniteScrollBatchSize);
}

export function getThumbURLsToPreload(poolItems: PoolItem[]): string[] {
  const result = [];

  for (const favorite of poolItems) {
    if (document.getElementById(favorite.id) === null) {
      result.push(favorite.thumbURL);
    }

    if (result.length >= PoolItemsSettings.infiniteScrollPreloadCount) {
      break;
    }
  }
  return result;
}
