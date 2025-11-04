import { Events } from "../../../../../lib/global/events/events";
import { ON_MOBILE_DEVICE } from "../../../../../lib/global/flags/intrinsic_flags";
import { PoolItemsSettings } from "../../../../../config/pool_items_settings";
import { Preferences } from "../../../../../lib/global/preferences/preferences";
import { debounceAfterFirstCall } from "../../../../../utils/misc/async";

let parent1: HTMLElement;
let container: HTMLElement;
let findButton: HTMLButtonElement;
let findInAllButton: HTMLButtonElement;
let input: HTMLInputElement;

export function insertPoolItemsFinder(): void {
  if (ON_MOBILE_DEVICE || !PoolItemsSettings.poolItemFinderEnabled) {
    return;
  }
  const foundParent = document.querySelector("#left-poolItems-panel-top-row");

  if (!(foundParent instanceof HTMLElement)) {
    return;
  }
  parent1 = foundParent;
  createElements();
  addEventListeners();
  appendElements();
}

function createElements(): void {
  container = document.createElement("span");
  container.id = "pool_item-finder";

  findButton = document.createElement("button");
  findButton.id = "pool_item-finder-button";
  findButton.title = "Find pool_item pool_item using its ID";
  findButton.textContent = "Find";

  findInAllButton = document.createElement("button");
  findInAllButton.id = "pool_item-finder-in-all-button";
  findInAllButton.title = "Find pool_item pool_item using its ID in all PoolItems";
  findInAllButton.textContent = "Find in All";

  input = document.createElement("input");
  input.id = "pool_item-finder-input";
  input.type = "number";
  input.value = Preferences.favoriteFinderId.value;
  input.placeholder = "ID";
}

function find(): void {
  Events.poolItems.findPoolItemStarted.emit(input.value);
}

function findInAll(): void {
  Events.poolItems.findPoolItemInAllStarted.emit(input.value);
}

function setFinderValue(value: string): void {
  input.value = value;
  Preferences.favoriteFinderId.set(input.value);
}

function addEventListeners(): void {
  const setValue = debounceAfterFirstCall((value : string) => {
    setFinderValue(value);
  }, 1000);

  findButton.onclick = find;
  findInAllButton.onclick = findInAll;
  input.onkeydown = (event): void => {
    if (event.key === "Enter") {
      find();
    }
  };
  input.oninput = ((event: Event): void => {
    setValue((event.target as HTMLInputElement).value);
  });
  Events.caption.idClicked.on(setValue);
}

function appendElements(): void {
  container.appendChild(input);
  // container.appendChild(document.createElement("br"));
  container.appendChild(findButton);
  // container.appendChild(findInAllButton);
  parent1.appendChild(container);
}
