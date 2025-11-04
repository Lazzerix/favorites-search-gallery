import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Events } from "../../../../../lib/global/events/events";
import { PoolItem } from "../../../types/pool_item/pool_item";
import { PoolItemsPageRelation } from "../../../types/pool_item/pool_items_types";
import { PoolItemsPresentationFlow } from "../../../types/pool_items_presentation_flow_interface";
import { NavigationKey } from "../../../../../types/common_types";
import { Preferences } from "../../../../../lib/global/preferences/preferences";

class PaginationFlow implements PoolItemsPresentationFlow {
    public present(results: PoolItem[]): void {
        PoolItemsModel.paginate(results);
        PoolItemsModel.changePage(1);
        this.showCurrentPage();
    }

    public gotoPage(pageNumber: number): void {
        PoolItemsModel.changePage(pageNumber);
        this.showCurrentPage();
    }

    public gotoRelativePage(relativePage: PoolItemsPageRelation): void {
        if (PoolItemsModel.gotoRelativePage(relativePage)) {
            this.showCurrentPage();
        }
    }

    public showCurrentPage(): void {
        PoolItemsView.showSearchResults(PoolItemsModel.getPoolItemsOnCurrentPage());
        PoolItemsView.createPageSelectionMenu(PoolItemsModel.getPaginationParameters());
        PoolItemsView.preloadThumbnails(PoolItemsModel.getPoolItemsOnNextPage());
        PoolItemsView.preloadThumbnails(PoolItemsModel.getPoolItemsOnPreviousPage());
        Events.poolItems.pageChanged.emit();
    }

    public onLayoutChanged(): void {
    }

    public revealFavorite(id: string): void {
        if (PoolItemsModel.gotoPageWithFavoriteId(id)) {
            this.showCurrentPage();
        }
        PoolItemsView.revealFavorite(id);
    }

    public handlePageChangeRequest(direction: NavigationKey): void {
        if (Preferences.infiniteScrollEnabled.value) {
            Events.poolItems.pageChangeResponse.emit(false);
            return;
        }
        this.gotoAdjacentPage(direction);
        Events.poolItems.pageChangeResponse.emit(true);
    }

    public reset(): void { }

    public handleNewSearchResults(): void {
        PoolItemsModel.paginate(PoolItemsModel.getLatestSearchResults());
        PoolItemsView.createPageSelectionMenuWhileFetching(PoolItemsModel.getPaginationParameters());
        this.addNewlyFetchedSearchResultsToCurrentPage();
        Events.poolItems.searchResultsUpdated.emit(PoolItemsModel.getLatestSearchResults());
    }

    public addNewlyFetchedSearchResultsToCurrentPage(): void {
        if (!PoolItemsModel.onFinalPage()) {
            return;
        }
        const newPoolItems = PoolItemsModel.getPoolItemsOnCurrentPage()
            .filter(favorite => document.getElementById(favorite.id) === null);
        const thumbs = newPoolItems.map(favorite => favorite.root);

        PoolItemsView.insertNewSearchResults(thumbs);
        Events.poolItems.resultsAddedToCurrentPage.emit(thumbs);
    }

    private gotoAdjacentPage(direction: NavigationKey): void {
        if (PoolItemsModel.gotoAdjacentPage(direction)) {
            this.showCurrentPage();
        }
    }
}

export const PoolItemsPaginationFlow = new PaginationFlow();
