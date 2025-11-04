import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsPresentationFlow from "../presentation/pool_items_presentation_flow";
import * as PoolItemsSearchFlow from "../runtime/pool_items_search_flow";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Events } from "../../../../../lib/global/events/events";
import { PoolItem } from "../../../types/pool_item/pool_item";

export async function loadAllPoolItems(): Promise<void> {
    console.log(`1 ${PoolItemsModel.getAllPoolItems().length}`);
    await loadAllPoolItemsFromDatabase();
    console.log(`2 ${PoolItemsModel.getAllPoolItems().length}`);

    if (hasPoolItems()) {
        console.log(`2.0 ${PoolItemsModel.getAllPoolItems().length}`);
        Events.poolItems.poolItemsLoadedFromDatabase.emit();
        console.log(`2.1 ${PoolItemsModel.getAllPoolItems().length}`);
        showLoadedPoolItems();
        console.log(`2.2 ${PoolItemsModel.getAllPoolItems().length}`);
        await loadNewPoolItems();
        console.log(`2.3 ${PoolItemsModel.getAllPoolItems().length}`);
    } else {
        console.log(`2.0B ${PoolItemsModel.getAllPoolItems().length}`);
        await fetchAllPoolItems();
        console.log(`2.1B ${PoolItemsModel.getAllPoolItems().length}`);
        Events.poolItems.startedStoringAllPoolItems.emit();
        console.log(`2.2B ${PoolItemsModel.getAllPoolItems().length}`);
        await saveAllPoolItems();
        console.log(`2.3B ${PoolItemsModel.getAllPoolItems().length}`);
    }
    console.log(`3 ${PoolItemsModel.getAllPoolItems().length}`);
    Events.poolItems.poolItemsLoaded.emit();
    console.log(`4 ${PoolItemsModel.getAllPoolItems().length}`);
}

async function loadAllPoolItemsFromDatabase(): Promise<void> {
  PoolItemsView.setStatus("Loading poolItems");
  await PoolItemsModel.loadAllPoolItemsFromDatabase();
}

function hasPoolItems(): boolean {
  return PoolItemsModel.getAllPoolItems().length > 0;
}

async function fetchAllPoolItems(): Promise<void> {
    console.log(`fetchAllPoolItems Start ${PoolItemsModel.getAllPoolItems().length}`);
  PoolItemsPresentationFlow.clear();
    console.log(`fetchAllPoolItems Mid1 ${PoolItemsModel.getAllPoolItems().length}`);
  Events.poolItems.startedFetchingPoolItems.emit();
    console.log(`fetchAllPoolItems Mid2 ${PoolItemsModel.getAllPoolItems().length}`);
  await PoolItemsModel.fetchAllPoolItems(processFetchedPoolItems);
    console.log(`fetchAllPoolItems End ${PoolItemsModel.getAllPoolItems().length}`);
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
    console.log(`processFetchedPoolItems Start ${PoolItemsModel.getAllPoolItems().length}`);
  PoolItemsView.updateStatusWhileFetching(PoolItemsModel.getLatestSearchResults().length, PoolItemsModel.getAllPoolItems().length);
    console.log(`processFetchedPoolItems Mid1 ${PoolItemsModel.getAllPoolItems().length}`);
  Events.poolItems.searchResultsUpdated.emit(PoolItemsModel.getLatestSearchResults());
    console.log(`processFetchedPoolItems Mid2 ${PoolItemsModel.getAllPoolItems().length}`);
  PoolItemsPresentationFlow.handleNewSearchResults();
    console.log(`processFetchedPoolItems Start ${PoolItemsModel.getAllPoolItems().length}`);
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
