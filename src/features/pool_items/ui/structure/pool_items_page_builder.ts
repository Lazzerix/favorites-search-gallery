import { buildPoolItemsMenu } from "./pool_items_menu_builder";
import { cleanOriginalPoolItemsPage } from "./pool_items_page_cleaner";
import { setupPoolItemsBottomNavigationButtons } from "../components/static/pool_items_bottom_navigation_buttons";

export function buildPoolItemsPage(): void {
  console.log("setupPoolItems start");
  cleanOriginalPoolItemsPage();
  buildPoolItemsMenu();
  setupPoolItemsBottomNavigationButtons();
}
