import { convertToTagString, getContentType } from "../primitive/string";
import { ContentType } from "../../types/common_types";
import { Favorite } from "../../types/favorite_types";
import { ON_SEARCH_PAGE } from "../../lib/global/flags/intrinsic_flags";
import { PoolItemRaw } from "../../types/pool_item_types";
import { getImageFromThumb } from "../dom/dom";
import { getTagSetFromItem } from "../dom/tags";

function isFavoriteContentType(item: Favorite | PoolItemRaw, contentType: ContentType): boolean {
  return getContentType(item.tags) === contentType;
}

function isThumbContentType(thumb: HTMLElement, contentType: ContentType): boolean {
  const image = getImageFromThumb(thumb);
  return image !== null && getContentType(getTagSetFromItem(thumb)) === contentType;
}

function isContentType(item: HTMLElement | Favorite | PoolItemRaw, contentType: ContentType): boolean {
  if (item instanceof HTMLElement) {
    return isThumbContentType(item, contentType);
  }
  return isFavoriteContentType(item, contentType);
}

export const isVideo = (item: HTMLElement | Favorite | PoolItemRaw): boolean => isContentType(item, "video");
export const isGif = (item: HTMLElement | Favorite | PoolItemRaw): boolean => isContentType(item, "gif");
export const isImage = (item: HTMLElement | Favorite | PoolItemRaw): boolean => isContentType(item, "image");

export function forceImageContentType(thumb: HTMLElement): void {
  if (!ON_SEARCH_PAGE) {
    return;
  }
  const tagSet = getTagSetFromItem(thumb);

  tagSet.delete("video");
  tagSet.delete("gif");
  tagSet.delete("mp4");
  tagSet.delete("animated");
  thumb.classList.remove("gif");
  thumb.classList.remove("video");
  const image = getImageFromThumb(thumb);

  if (image === null) {
    return;
  }
  image.classList.remove("gif");
  image.classList.remove("video");
  image.setAttribute("tags", convertToTagString(tagSet));
}
