import { awesompleteIsUnselected, awesompleteIsVisible, hideAwesomplete } from "../../../../utils/dom/awesomplete";
import { Events } from "../../../../lib/global/events/events";
import { PoolItemsMouseEvent } from "../../../../types/input_types";
import { ON_MOBILE_DEVICE } from "../../../../lib/global/flags/intrinsic_flags";
import { SearchHistory } from "./pool_items_search_history";
import { createDesktopSearchBar } from "./pool_items_desktop_search_box";
import { createMobileSearchBar } from "./pool_items_mobile_search_box";
import { debounceAfterFirstCall } from "../../../../utils/misc/async";
import { openSearchPage } from "../../../../utils/dom/links";

let SEARCH_BOX: HTMLTextAreaElement | HTMLInputElement;
const PARENT_ID: string = "left-poolItems-panel-top-row";
const ID: string = "poolItems-search-box";
const SEARCH_HISTORY: SearchHistory = new SearchHistory(30);

function addEventListenersToSearchBox(): void {
  Events.caption.searchForTag.on((tag) => {
    SEARCH_BOX.value = tag;
    startSearch();
  });
  Events.searchBox.appendSearchBox.on((text) => {
    const initialSearchBoxValue = SEARCH_BOX.value;
    const optionalSpace = initialSearchBoxValue === "" ? "" : " ";
    const newSearchBoxValue = `${initialSearchBoxValue}${optionalSpace}${text}`;

    SEARCH_BOX.value = newSearchBoxValue;
    SEARCH_HISTORY.add(newSearchBoxValue);
    updateLastEditedSearchQuery();
  });
  Events.poolItems.searchButtonClicked.on(onSearchButtonClicked);
  Events.poolItems.clearButtonClicked.on(() => {
    SEARCH_BOX.value = "";
  });
  Events.poolItems.searchBoxUpdated.on(() => {
    updateLastEditedSearchQuery();
  });
  SEARCH_BOX.addEventListener("keydown", (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === "Enter") {
      if (!event.repeat && awesompleteIsUnselected(SEARCH_BOX)) {
        event.preventDefault();
        startSearch();
      }
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!awesompleteIsVisible(SEARCH_BOX)) {
        event.preventDefault();
        SEARCH_HISTORY.navigate(event.key);
        SEARCH_BOX.value = SEARCH_HISTORY.selectedQuery;
      }
    }
  });
  updateLastEditedSearchQueryOnInput();
}

function updateLastEditedSearchQueryOnInput(): void {
  SEARCH_BOX.addEventListener("keyup", debounceAfterFirstCall((event: KeyboardEvent) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
      updateLastEditedSearchQuery();
    }
  }, 500) as EventListener);
}

function updateLastEditedSearchQuery(): void {
  SEARCH_HISTORY.updateLastEditedSearchQuery(SEARCH_BOX.value);
}

function onSearchButtonClicked(event: MouseEvent): void {
  const mouseEvent = new PoolItemsMouseEvent(event);

  if (mouseEvent.rightClick || mouseEvent.ctrlKey) {
    openSearchPage(SEARCH_BOX.value);
    return;
  }
  startSearch();
}

function startSearch(): void {
  SEARCH_HISTORY.add(SEARCH_BOX.value);
  updateLastEditedSearchQuery();
  hideAwesomplete(SEARCH_BOX);
  Events.poolItems.searchStarted.emit(SEARCH_BOX.value);
}

export function setupPoolItemsSearchBox(): void {
  SEARCH_BOX = ON_MOBILE_DEVICE ? createMobileSearchBar(ID, PARENT_ID, startSearch) : createDesktopSearchBar(ID, PARENT_ID, SEARCH_HISTORY.lastEditedQuery);
  addEventListenersToSearchBox();
}
