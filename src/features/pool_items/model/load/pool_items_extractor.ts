import {PoolItem} from "../../types/pool_item/pool_item";

const PARSER = new DOMParser();

function extractFavoriteElements(poolItemsPageHTML: string): HTMLElement[] {
  const dom = PARSER.parseFromString(poolItemsPageHTML, "text/html");
  const thumbs = Array.from(dom.querySelectorAll(".thumb"));

  if (thumbs.length > 0) {
    return thumbs.filter(thumb => thumb instanceof HTMLElement);
  }
  return Array.from(dom.querySelectorAll("img"))
    .filter(image => image.src.includes("thumbnail_"))
    .map(image => image.parentElement)
    .filter(thumb => thumb !== null);
}

export function extractPoolItems(poolItemsPageHTML: string): PoolItem[] {
  return extractFavoriteElements(poolItemsPageHTML).map(element => new PoolItem(element));
}
