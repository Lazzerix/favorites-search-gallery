import * as API from "../../../../lib/api/api";
import { FAVORITES_SEARCH_GALLERY_CONTAINER } from "../../../../lib/global/container";
import { ON_MOBILE_DEVICE } from "../../../../lib/global/flags/intrinsic_flags";
import { Timeout } from "../../../../types/common_types";
import { getPoolName } from "../../../../lib/api/api";

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
  try {
    expectedTotalPoolItemsCount = await API.getPoolItemCount();
    console.log("expectedTotalPoolItemsCount", expectedTotalPoolItemsCount);
  } catch (exception) {
    console.error("setExpectedTotalPoolItemsCount ", exception);
  }
}

export async function setupPoolItemsStatus(): Promise<void> {
  console.log("setupPoolItemsStatus");
  setExpectedTotalPoolItemsCount();
  matchCountIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#match-count-label") ?? document.createElement("label");
  statusIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#favorites-load-status-label") ?? document.createElement("label");
  console.log("statusIndicator set ", statusIndicator);
  // this needs to have an await and this function needs to be async to be able to get the name correctly
  const poolName = await getPoolName();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  document.getElementById("search-header").textContent = `Pool: ${poolName}`;
}
