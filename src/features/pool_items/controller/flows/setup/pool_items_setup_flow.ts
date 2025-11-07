import * as PoolItemsLoadFlow from "./pool_items_load_flow";
import * as PoolItemsView from "../../../view/pool_items_view";
import { ON_POOL_ITEMS_PAGE } from "../../../../../lib/global/flags/intrinsic_flags";
import { addPoolItemsEventsListeners } from "../../events/pool_items_event_listeners";
import { buildPoolItemsPage } from "../../../ui/structure/pool_items_page_builder";

export function setupPoolItems(): void {
  if (ON_POOL_ITEMS_PAGE) {
    buildPoolItemsPage();
    PoolItemsView.setupPoolItemsView();
    addPoolItemsEventsListeners();
    PoolItemsLoadFlow.loadAllPoolItems();
    console.log("setupPoolItems end\n");
  }
}
