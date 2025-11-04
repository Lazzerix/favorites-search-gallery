import * as API from "../../../../lib/api/api";
import * as PoolItemsFetchQueue from "./pool_items_fetch_queue";
import { PoolItem } from "../../types/pool_item/pool_item";
import { PoolItemsPageRequest } from "./pool_items_page_request";
import { PoolItemsSettings } from "../../../../config/pool_items_settings";
import { extractPoolItems } from "./pool_items_extractor";
import { sleep } from "../../../../utils/misc/async";

const PENDING_REQUEST_PAGE_NUMBERS = new Set<number>();
const FAILED_REQUESTS: PoolItemsPageRequest[] = [];
let storedFavoriteIds = new Set<string>();
let currentPageNumber = 0;
let fetchedAnEmptyPage = false;

function hasFailedRequests(): boolean {
  return FAILED_REQUESTS.length > 0;
}

function hasPendingRequests(): boolean {
  return PENDING_REQUEST_PAGE_NUMBERS.size > 0;
}

function allRequestsHaveStarted(): boolean {
  return fetchedAnEmptyPage;
}

function someRequestsArePending(): boolean {
  return hasPendingRequests() || hasFailedRequests();
}

function noRequestsArePending(): boolean {
  return !someRequestsArePending();
}

function allRequestsHaveCompleted(): boolean {
  return allRequestsHaveStarted() && noRequestsArePending();
}

function someRequestsAreIncomplete(): boolean {
  return !allRequestsHaveCompleted();
}

function oldestFailedFetchRequest(): PoolItemsPageRequest | null {
  return FAILED_REQUESTS.shift() ?? null;
}

function getNewFetchRequest(): PoolItemsPageRequest {
  const request = new PoolItemsPageRequest(currentPageNumber);

  PENDING_REQUEST_PAGE_NUMBERS.add(request.realPageNumber);
  currentPageNumber += 1;
  return request;
}

function nextFetchRequest(): PoolItemsPageRequest | null {
  if (hasFailedRequests()) {
    return oldestFailedFetchRequest();
  }

  if (!allRequestsHaveStarted()) {
    return getNewFetchRequest();
  }
  return null;
}

async function fetchNextPoolItemsPage(): Promise<void> {
  const request = nextFetchRequest();

  if (request === null) {
    await sleep(200);
    return;
  }
  await fetchPoolItemsPageHelper(request);
}

async function fetchPoolItemsPageHelper(request: PoolItemsPageRequest): Promise<void> {
  API.fetchPoolItemsPage(request.realPageNumber)
    .then((html) => {
      onPoolItemsPageRequestSuccess(request, html);
    })
    .catch((error) => {
      onPoolItemsPageRequestError(request, error);
    });
  await sleep(request.fetchDelay);
}

function onPoolItemsPageRequestSuccess(request: PoolItemsPageRequest, html: string): void {
  request.poolItems = extractPoolItems(html);
  populateMultipleMetadataFromAPI(request.poolItems);
  PENDING_REQUEST_PAGE_NUMBERS.delete(request.realPageNumber);
  const poolItemsPageIsEmpty = request.poolItems.length === 0;

  fetchedAnEmptyPage = fetchedAnEmptyPage || poolItemsPageIsEmpty;

  if (!poolItemsPageIsEmpty) {
    PoolItemsFetchQueue.enqueue(request);
  }
}

function onPoolItemsPageRequestError(request: PoolItemsPageRequest, error: Error): void {
  console.error(error);
  request.retry();
  FAILED_REQUESTS.push(request);
}

async function populateMultipleMetadataFromAPI(poolItems: PoolItem[]): Promise<void> {
  if (!PoolItemsSettings.fetchMultiplePostWhileFetchingPoolItems) {
    return;
  }
  const favoriteMap = poolItems.reduce((map, favorite) => {
    map[favorite.id] = favorite;
    return map;
  }, {} as Record<string, PoolItem>);
  const postMap = await API.fetchMultiplePostsFromAPI(Array.from(Object.keys(favoriteMap)));

  for (const [id, post] of Object.entries(postMap)) {
    favoriteMap[id].processPost(post);
  }
}

function fetchNewPoolItemsOnReloadHelper(): Promise<{ allNewPoolItemsFound: boolean, newPoolItems: PoolItem[] }> {
  return API.fetchPoolItemsPage(getNewFetchRequest().realPageNumber)
    .then((html) => {
      return extractNewPoolItems(html);
    });
}

function extractNewPoolItems(html: string): { allNewPoolItemsFound: boolean, newPoolItems: PoolItem[] } {
  const newPoolItems = [];
  const fetchedPoolItems = extractPoolItems(html);
  let allNewPoolItemsFound = fetchedPoolItems.length === 0;

  for (const favorite of fetchedPoolItems) {
    if (storedFavoriteIds.has(favorite.id)) {
      allNewPoolItemsFound = true;
      break;
    }
    newPoolItems.push(favorite);
  }
  return {
    allNewPoolItemsFound,
    newPoolItems
  };
}

export async function fetchAllPoolItems(onPoolItemsFound: (poolItems: PoolItem[]) => void): Promise<void> {
  PoolItemsFetchQueue.setDequeueCallback(onPoolItemsFound);

  while (someRequestsAreIncomplete()) {
    await fetchNextPoolItemsPage();
  }
}

export async function fetchNewPoolItemsOnReload(ids: Set<string>): Promise<PoolItem[]> {
  await sleep(100);
  storedFavoriteIds = ids;
  let poolItems: PoolItem[] = [];

  while (true) {
    const { allNewPoolItemsFound, newPoolItems } = await fetchNewPoolItemsOnReloadHelper();

    populateMultipleMetadataFromAPI(newPoolItems);
    poolItems = poolItems.concat(newPoolItems);

    if (allNewPoolItemsFound) {
      storedFavoriteIds.clear();
      return poolItems;
    }
  }
}
