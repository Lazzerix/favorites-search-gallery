import * as PoolItemsModel from "../../../model/pool_items_model";
import * as PoolItemsView from "../../../view/pool_items_view";
import { Events } from "../../../../../lib/global/events/events";
import { PoolItemsPresentationFlow } from "../../../types/pool_items_presentation_flow_interface";
import { ON_POOL_ITEMS_PAGE } from "../../../../../lib/global/flags/intrinsic_flags";
import { PageBottomObserver } from "../../../../../lib/components/page_bottom_observer";
import { sleep } from "../../../../../utils/misc/async";
import { waitForAllThumbnailsToLoad } from "../../../../../utils/dom/dom";

class InfiniteScrollFlow implements PoolItemsPresentationFlow {
  private readonly pageBottomObserver: PageBottomObserver;

  constructor() {
    this.pageBottomObserver = new PageBottomObserver(this.showMoreResults.bind(this));
  }

  public present(): void {
    this.showFirstResults();
    Events.poolItems.pageChanged.emit();
  }

  public onLayoutChanged(): void {
    this.pageBottomObserver.refresh();
  }

  public reset(): void {
    this.pageBottomObserver.disconnect();
  }

  public handleNewSearchResults(): void {
    if (PoolItemsModel.noPoolItemsAreVisible()) {
      this.showMoreResults();
    }
  }

  public revealFavorite(): void { }
  public handlePageChangeRequest(): void { }

  private async showMoreResults(): Promise<void> {
    if (!ON_POOL_ITEMS_PAGE) {
      return;
    }
    const moreResults = PoolItemsModel.getMoreResults();

    if (moreResults.length === 0) {
      return;
    }
    PoolItemsView.insertNewSearchResults(moreResults);
    Events.poolItems.resultsAddedToCurrentPage.emit(moreResults);
    await waitForAllThumbnailsToLoad();
    const urlsToPreload = PoolItemsModel.getThumbURLsToPreload();

    PoolItemsView.preloadURLs(urlsToPreload);

    this.pageBottomObserver.refresh();
  }

  private async showFirstResults(): Promise<void> {
    PoolItemsView.showSearchResults(PoolItemsModel.getFirstResults());
    await waitForAllThumbnailsToLoad();
    this.pageBottomObserver.refresh();
    await sleep(50);
  }
}

export const PoolItemsInfiniteScrollFlow = new InfiniteScrollFlow();
