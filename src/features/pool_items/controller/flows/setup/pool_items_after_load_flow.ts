import * as PoolItemsMetadataUpdateFlow from "./pool_items_metadata_update_flow";
import * as PoolItemsModel from "../../../model/pool_items_model";
import { collectAspectRatios } from "../../../../../lib/global/content/skeleton/aspect_ratio_collector";

export function onPoolItemsLoaded(): void {
    console.log(`5 ${PoolItemsModel.getAllPoolItems().length}`);
    PoolItemsMetadataUpdateFlow.updateMissingMetadata();
    console.log(`6 ${PoolItemsModel.getAllPoolItems().length}`);
    collectAspectRatios();
    console.log(`7 ${PoolItemsModel.getAllPoolItems().length}`);
    PoolItemsModel.buildSearchIndexAsynchronously();
    console.log(`8 ${PoolItemsModel.getAllPoolItems().length}`);
}

export function onPoolItemsLoadedFromDatabase(): void {
    console.log(`onPoolItemsLoadedFromDatabase Start ${PoolItemsModel.getAllPoolItems().length}`);
    PoolItemsModel.keepIndexedTagsSorted();
    console.log(`onPoolItemsLoadedFromDatabase End ${PoolItemsModel.getAllPoolItems().length}`);
}

export function onStartedFetchingPoolItems(): void {
    console.log(`onStartedFetchingPoolItems Start ${PoolItemsModel.getAllPoolItems().length}`);
    PoolItemsModel.keepIndexedTagsSorted();
    console.log(`onStartedFetchingPoolItems Mid ${PoolItemsModel.getAllPoolItems().length}`);
    PoolItemsModel.buildSearchIndexSynchronously();
    console.log(`onStartedFetchingPoolItems End ${PoolItemsModel.getAllPoolItems().length}`);
}

export function onStartedStoringAllPoolItems(): void {
  PoolItemsModel.onStartedStoringPoolItems();
}
