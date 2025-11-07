import * as PoolItemsAfterLoadFlow from "../flows/setup/pool_items_after_load_flow";
import * as PoolItemsModel from "../../model/pool_items_model";
import * as PoolItemsOptionsFlow from "../flows/runtime/pool_items_option_flow";
import * as PoolItemsPresentationFlow from "../flows/presentation/pool_items_presentation_flow";
import * as PoolItemsResetFlow from "../flows/runtime/pool_items_reset_flow";
import * as PoolItemsSearchFlow from "../flows/runtime/pool_items_search_flow";
import { Events } from "../../../../lib/global/events/events";
import { PoolItemsPaginationFlow } from "../flows/presentation/pool_items_pagination_flow";
import { updateShowOnHoverOptionTriggeredFromGallery } from "../../ui/pool_items_menu_event_handlers";

export function addPoolItemsEventsListeners(): void {
  console.log("addPoolItemsEventsListeners start");
  Events.poolItems.poolItemsLoadedFromDatabase.on(PoolItemsAfterLoadFlow.onPoolItemsLoadedFromDatabase, {once: true});
  Events.poolItems.startedFetchingPoolItems.on(PoolItemsAfterLoadFlow.onStartedFetchingPoolItems, {once: true});
  Events.poolItems.startedStoringAllPoolItems.on(PoolItemsAfterLoadFlow.onStartedStoringAllPoolItems, {once: true});
  Events.poolItems.poolItemsLoaded.on(PoolItemsAfterLoadFlow.onPoolItemsLoaded, {once: true});

  Events.poolItems.searchStarted.on(PoolItemsSearchFlow.searchPoolItems);
  Events.poolItems.shuffleButtonClicked.on(PoolItemsSearchFlow.shuffleSearchResults);
  Events.poolItems.invertButtonClicked.on(PoolItemsSearchFlow.invertSearchResults);
  Events.poolItems.pageSelected.on(PoolItemsPaginationFlow.gotoPage.bind(PoolItemsPaginationFlow));
  Events.poolItems.relativePageSelected.on(PoolItemsPaginationFlow.gotoRelativePage.bind(PoolItemsPaginationFlow));
  Events.poolItems.searchSubsetClicked.on(PoolItemsModel.setSearchSubset);
  Events.poolItems.stopSearchSubsetClicked.on(PoolItemsModel.stopSearchSubset);

  Events.poolItems.resetConfirmed.on(PoolItemsResetFlow.resetPoolItems);
  Events.poolItems.poolItemRemoved.on(PoolItemsModel.deleteFavorite);
  Events.poolItems.missingMetadataFound.on(PoolItemsModel.updateMetadata);
  Events.poolItems.findPoolItemStarted.on(PoolItemsPresentationFlow.revealFavorite);
  Events.poolItems.findPoolItemInAllStarted.on(PoolItemsSearchFlow.findFavoriteInAll);

  Events.gallery.pageChangeRequested.on(PoolItemsPaginationFlow.handlePageChangeRequest.bind(PoolItemsPaginationFlow));
  Events.gallery.showOnHoverToggled.on(updateShowOnHoverOptionTriggeredFromGallery);
  Events.gallery.favoriteToggled.on(PoolItemsModel.swapFavoriteButton);
  Events.tagModifier.resetConfirmed.on(PoolItemsModel.resetTagModifications);

  Events.poolItems.infiniteScrollToggled.on(PoolItemsOptionsFlow.toggleInfiniteScroll);
  Events.poolItems.blacklistToggled.on(PoolItemsOptionsFlow.toggleBlacklist);
  Events.poolItems.layoutChanged.on(PoolItemsOptionsFlow.changeLayout);
  Events.poolItems.sortAscendingToggled.on(PoolItemsOptionsFlow.toggleSortAscending);
  Events.poolItems.sortingMethodChanged.on(PoolItemsOptionsFlow.changeSortingMethod);
  Events.poolItems.allowedRatingsChanged.on(PoolItemsOptionsFlow.changeAllowedRatings);
  Events.poolItems.resultsPerPageChanged.on(PoolItemsOptionsFlow.changeResultsPerPage);
}
