import * as PoolItemsMetadataUpdateFlow from "./pool_items_metadata_update_flow";
import * as PoolItemsModel from "../../../model/pool_items_model";
import { collectAspectRatios } from "../../../../../lib/global/content/skeleton/aspect_ratio_collector";

export function onPoolItemsLoaded(): void {
    PoolItemsMetadataUpdateFlow.updateMissingMetadata();
    collectAspectRatios();
    PoolItemsModel.buildSearchIndexAsynchronously();
}

export function onPoolItemsLoadedFromDatabase(): void {
    PoolItemsModel.keepIndexedTagsSorted();
}

export function onStartedFetchingPoolItems(): void {
    PoolItemsModel.keepIndexedTagsSorted();
    PoolItemsModel.buildSearchIndexSynchronously();
}

export function onStartedStoringAllPoolItems(): void {
  PoolItemsModel.onStartedStoringPoolItems();
}
