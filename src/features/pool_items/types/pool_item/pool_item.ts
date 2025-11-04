import { PoolItemMetricMap, PoolItemRaw, PoolItemsDatabaseRecord } from "../../../../types/pool_item_types";
import { Post, Rating } from "../../../../types/common_types";
import { clearPost, createPostFromRawFavorite } from "./pool_items_type_utils";
import { FavoriteHTMLElement } from "./pool_items_element";
import { FavoriteMetadata } from "../metadata/pool_items_metadata";
import { FavoriteTags } from "./pool_items_tags";
import { POOL_ITEMS_SEARCH_INDEX } from "../../model/search/index/pool_items_search_index";
import { compressPreviewSource } from "../../../../utils/content/image_url";
import { getIdFromThumb } from "../../../../utils/dom/dom";

const ALL_POOL_ITEMS = new Map<string, PoolItem>();

export function getFavorite(id: string): PoolItem | undefined {
  return ALL_POOL_ITEMS.get(id);
}

export function getAllPoolItems(): PoolItem[] {
  return Array.from(ALL_POOL_ITEMS.values());
}

export function validateTags(post: Post): void {
  const favorite = getFavorite(post.id);

  if (favorite !== undefined) {
    favorite.validateTags(post);
  }
}

function registerFavorite(favorite: PoolItem): void {
  if (!ALL_POOL_ITEMS.has(favorite.id)) {
    ALL_POOL_ITEMS.set(favorite.id, favorite);
    POOL_ITEMS_SEARCH_INDEX.add(favorite);
  }
}

export class PoolItem implements PoolItemRaw {
  public id: string;
  private post: Post;
  private element: FavoriteHTMLElement | null;
  private favoriteTags: FavoriteTags;
  private metadata: FavoriteMetadata;

  constructor(object: HTMLElement | PoolItemsDatabaseRecord) {
    this.id = object instanceof HTMLElement ? getIdFromThumb(object) : object.id;
    this.post = createPostFromRawFavorite(object);
    this.element = null;
    this.favoriteTags = new FavoriteTags(this.post, object);
    registerFavorite(this);
    this.metadata = new FavoriteMetadata(this.id, object);
  }

  public get tags(): Set<string> {
    return this.favoriteTags.tags;
  }

  public get root(): HTMLElement {
    if (this.element === null) {
      this.post.tags = this.favoriteTags.tagString;
      this.element = new FavoriteHTMLElement(this.post);
    }
    clearPost(this.post);
    return this.element.root;
  }

  public get thumbURL(): string {
    return this.element === null ? this.post.previewURL : this.element.thumbURL;
  }

  public get metrics(): PoolItemMetricMap {
    return this.metadata.metrics;
  }

  public get databaseRecord(): PoolItemsDatabaseRecord {
    return {
      id: this.id,
      tags: this.tags,
      src: compressPreviewSource(this.thumbURL),
      metadata: this.metadata.databaseRecord
    };
  }

  public withinRating(rating: Rating): boolean {
    // eslint-disable-next-line no-bitwise
    return (this.metadata.rating & rating) > 0;
  }

  public validateTags(post: Post): void {
    if (!this.favoriteTags.tagsAreEqual(post)) {
      this.updateTags(post.tags);
    }
  }

  public swapPoolItemButton(): void {
    if (this.element !== null) {
      this.element.swapFavoriteButton();
    }
  }

  public processPost(post: Post): void {
    this.metadata.processPost(post);
  }

  public addAdditionalTags(newTags: string): string {
    POOL_ITEMS_SEARCH_INDEX.remove(this);
    const result = this.favoriteTags.addAdditionalTags(newTags);

    POOL_ITEMS_SEARCH_INDEX.add(this);
    return result;
  }

  public removeAdditionalTags(tagsToRemove: string): string {
    POOL_ITEMS_SEARCH_INDEX.remove(this);
    const result = this.favoriteTags.removeAdditionalTags(tagsToRemove);

    POOL_ITEMS_SEARCH_INDEX.add(this);
    return result;
  }

  public resetAdditionalTags(): void {
    POOL_ITEMS_SEARCH_INDEX.remove(this);
    this.favoriteTags.resetAdditionalTags();
    POOL_ITEMS_SEARCH_INDEX.add(this);
  }

  private updateTags(tags: string): void {
    POOL_ITEMS_SEARCH_INDEX.remove(this);
    this.favoriteTags.update(tags);
    POOL_ITEMS_SEARCH_INDEX.add(this);
  }
}
