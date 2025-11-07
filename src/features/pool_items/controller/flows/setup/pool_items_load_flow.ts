import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsPresentationFlow from "../presentation/pool_items_presentation_flow";
import * as PoolItemsSearchFlow from "../runtime/pool_items_search_flow";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Events } from "../../../../../lib/global/events/events";
import { PoolItem } from "../../../types/pool_item/pool_item";

export async function loadAllPoolItems(): Promise<void> {
  console.log("loadAllPoolItems start");
  await loadAllPoolItemsFromDatabase();

  if (hasPoolItems()) {
    console.log("loadAllPoolItems start");
    Events.poolItems.poolItemsLoadedFromDatabase.emit();
    showLoadedPoolItems();
    await loadNewPoolItems();
  } else {
    await fetchAllPoolItems();
    Events.poolItems.startedStoringAllPoolItems.emit();
    await saveAllPoolItems();
  }
  Events.poolItems.poolItemsLoaded.emit();
}

async function loadAllPoolItemsFromDatabase(): Promise<void> {
  PoolItemsView.setStatus("Loading poolItems");
  await PoolItemsModel.loadAllPoolItemsFromDatabase();
}

function hasPoolItems(): boolean {
  return PoolItemsModel.getAllPoolItems().length > 0;
}

async function fetchAllPoolItems(): Promise<void> {
  console.log("fetchAllPoolItems start");
  PoolItemsPresentationFlow.clear();
  Events.poolItems.startedFetchingPoolItems.emit();
  await PoolItemsModel.fetchAllPoolItems(processFetchedPoolItems);
}

async function saveAllPoolItems(): Promise<void> {
  PoolItemsView.setStatus("Saving poolItems");
  await PoolItemsModel.storeAllPoolItems();
  PoolItemsView.setTemporaryStatus("All poolItems saved");
}

function showLoadedPoolItems(): void {
  PoolItemsView.setTemporaryStatus("PoolItems loaded");
  PoolItemsSearchFlow.showLatestSearchResults();
}

function processFetchedPoolItems(): void {
  PoolItemsView.updateStatusWhileFetching(PoolItemsModel.getLatestSearchResults().length, PoolItemsModel.getAllPoolItems().length);
  Events.poolItems.searchResultsUpdated.emit(PoolItemsModel.getLatestSearchResults());
  PoolItemsPresentationFlow.handleNewSearchResults();
}

async function loadNewPoolItems(): Promise<void> {
  const results = await PoolItemsModel.fetchNewPoolItemsOnReload();

  if (results.newSearchResults.length === 0) {
    return;
  }
  PoolItemsView.insertNewSearchResultsOnReload(results);
  saveNewPoolItems(results.newPoolItems);
  PoolItemsModel.paginate(PoolItemsModel.getLatestSearchResults());
  Events.poolItems.newPoolItemsFoundOnReload.emit(results.newSearchResults);
  Events.poolItems.searchResultsUpdated.emit(results.allSearchResults);
}

async function saveNewPoolItems(newPoolItems: PoolItem[]): Promise<void> {
  await PoolItemsModel.storeNewPoolItems(newPoolItems);
  PoolItemsView.setTemporaryStatus("New poolItems saved");
}
