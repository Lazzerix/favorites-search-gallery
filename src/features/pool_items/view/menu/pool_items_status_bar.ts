import * as API from "../../../../lib/api/api";
import { FAVORITES_SEARCH_GALLERY_CONTAINER } from "../../../../lib/global/container";
import { ON_MOBILE_DEVICE } from "../../../../lib/global/flags/intrinsic_flags";
import { Timeout } from "../../../../types/common_types";
import { getPoolItemsPageId } from "../../../../utils/misc/pool_items_page_metadata";

let matchCountIndicator: HTMLElement;
let statusIndicator: HTMLElement;
let expectedTotalPoolItemsCount: number | null = null;
let statusTimeout: Timeout;
const TEMPORARY_STATUS_TIMEOUT = 1000;
const FETCHING_STATUS_PREFIX = ON_MOBILE_DEVICE ? "" : "PoolItems ";

export function setStatus(text: string): void {
  clearTimeout(statusTimeout);
  statusIndicator.classList.remove("hidden");
  statusIndicator.textContent = text;
}

export function clearStatus(): void {
  statusIndicator.textContent = "";
  statusIndicator.classList.add("hidden");
}

export function setTemporaryStatus(text: string): void {
  setStatus(text);
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(clearStatus, TEMPORARY_STATUS_TIMEOUT);
}

export function setMatchCount(value: number): void {
  matchCountIndicator.textContent = `${value} ${value === 1 ? "Result" : "Results"}`;
}

export function updateStatusWhileFetching(searchResultsCount: number, poolItemsFoundCount: number): void {
  let statusText = `Fetching ${FETCHING_STATUS_PREFIX}${poolItemsFoundCount}`;

  if (expectedTotalPoolItemsCount !== null) {
    statusText = `${statusText} / ${expectedTotalPoolItemsCount}`;
  }
  setStatus(statusText);
  setMatchCount(searchResultsCount);
}

export function notifyNewPoolItemsFound(newPoolItemsCount: number): void {
  if (newPoolItemsCount > 0) {
    setStatus(`Found ${newPoolItemsCount} new favorite${newPoolItemsCount > 1 ? "s" : ""}`);
  }
}

async function setExpectedTotalPoolItemsCount(): Promise<void> {
    expectedTotalPoolItemsCount = await API.getPoolItemsCount();
}

export function setupPoolItemsStatus(): void {
  setExpectedTotalPoolItemsCount();
  matchCountIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#match-count-label") ?? document.createElement("label");
  statusIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#favorites-load-status-label") ?? document.createElement("label");
}
