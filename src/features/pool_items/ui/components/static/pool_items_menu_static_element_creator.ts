import { createPoolItemsHelpMenu } from "./pool_items_help_menu";
import { insertPoolItemsFinder } from "./pool_items_finder";
import { insertPoolItemsRatingFilter } from "./pool_items_rating_filter";
import { setupPoolItemsSearchBox } from "../../search_box/pool_items_search_box";

export function createStaticPoolItemsMenuElements(): void {
  insertPoolItemsFinder();
  createPoolItemsHelpMenu();
  insertPoolItemsRatingFilter();
  setupPoolItemsSearchBox();
}
