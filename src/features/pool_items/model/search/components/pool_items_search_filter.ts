import { POOL_ITEMS_PER_PAGE } from "../../../../../lib/global/constants";
import { POOL_ITEMS_SEARCH_INDEX } from "../index/pool_items_search_index";
import { PoolItem } from "../../../types/pool_item/pool_item";
import { PoolItemsSettings } from "../../../../../config/pool_items_settings";
import { Preferences } from "../../../../../lib/global/preferences/preferences";
import { Rating } from "../../../../../types/common_types";
import { SearchCommand } from "../search_command/search_command";
import {USER_IS_ON_THEIR_OWN_POOL_PAGE } from "../../../../../lib/global/flags/intrinsic_flags";
import { getTagBlacklist } from "../../../../../utils/misc/pool_items_page_metadata";
import { negateTags } from "../../../../../utils/primitive/string";

const NEGATED_TAG_BLACKLIST = negateTags(getTagBlacklist());
let searchQuery = "";
let useTagBlacklist = !USER_IS_ON_THEIR_OWN_POOL_PAGE || Preferences.excludeBlacklistEnabled.value;
let allowedRatings = Preferences.allowedRatings.value;
let searchCommand: SearchCommand<PoolItem> = updateSearchCommand();

function allRatingsAreAllowed(): boolean {
  return allowedRatings === 7;
}

function getFinalSearchQuery(): string {
  return useTagBlacklist ? `${searchQuery} ${NEGATED_TAG_BLACKLIST}` : searchQuery;
}

function updateSearchCommand(): SearchCommand<PoolItem> {
  searchCommand = new SearchCommand(getFinalSearchQuery());
  return searchCommand;
}

function shouldUseIndex(poolItems: PoolItem[]): boolean {
  return PoolItemsSettings.useSearchIndex && POOL_ITEMS_SEARCH_INDEX.ready && !searchCommand.details.hasMetadataTag && poolItems.length > POOL_ITEMS_PER_PAGE;
}

export function filter(poolItems: PoolItem[]): PoolItem[] {
  const results = shouldUseIndex(poolItems) ? POOL_ITEMS_SEARCH_INDEX.getSearchResults(searchCommand, poolItems) : searchCommand.getSearchResults(poolItems);
  return filterByRating(results);
}

export function filterByRating(poolItems: PoolItem[]): PoolItem[] {
  return allRatingsAreAllowed() ? poolItems : poolItems.filter(result => result.withinRating(allowedRatings));
}

export function filterOutBlacklisted(poolItems: PoolItem[]): PoolItem[] {
  return USER_IS_ON_THEIR_OWN_POOL_PAGE ? poolItems : new SearchCommand<PoolItem>(NEGATED_TAG_BLACKLIST).getSearchResults(poolItems);
}

export function setSearchQuery(newSearchQuery: string): void {
  searchQuery = newSearchQuery;
  updateSearchCommand();
}

export function toggleBlacklistFiltering(value: boolean): void {
  useTagBlacklist = value;
  updateSearchCommand();
}

export function setAllowedRatings(newAllowedRating: Rating): void {
  allowedRatings = newAllowedRating;
}
