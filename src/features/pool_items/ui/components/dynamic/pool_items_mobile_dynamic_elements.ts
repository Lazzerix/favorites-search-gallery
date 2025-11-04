import { ButtonElement, CheckboxElement, SelectElement } from "../../../../../types/element_types";
import { Layout, MetadataMetric, PerformanceProfile } from "../../../../../types/common_types";
import { toggleAddOrRemoveButtons, toggleDownloadButtons, toggleHeader } from "../../../../../utils/dom/ui_element";
import { toggleDarkTheme, usingDarkTheme } from "../../../../../utils/dom/style";
import { Events } from "../../../../../lib/global/events/events";
import { GALLERY_ENABLED } from "../../../../../lib/global/flags/derived_flags";
import { Preferences } from "../../../../../lib/global/preferences/preferences";
import { USER_IS_ON_THEIR_OWN_POOL_PAGE } from "../../../../../lib/global/flags/intrinsic_flags";
import { createButtonElement } from "../../../../../lib/ui/button";
import { createSelectElement } from "../../../../../lib/ui/select";
import { createToggleSwitch } from "../../../../../lib/ui/checkbox";
import { hideUnusedLayoutSizer } from "../../../../../lib/global/content/tilers/tiler_event_handlers";
import { prepareDynamicElements } from "../../../../../lib/ui/element_utils";

const BUTTONS: Partial<ButtonElement>[] = [
  {
    id: "download-button",
    parentId: "additional-favorites-options",
    textContent: "Download",
    title: "Download search results",
    event: Events.poolItems.downloadButtonClicked,
    position: "beforeend"
  }
];

const TOGGLE_SWITCHES: Partial<CheckboxElement>[] = [
  {
    id: "infinite-scroll",
    parentId: "favorites-options-left",
    textContent: "Infinite Scroll",
    title: "Use infinite scroll (waterfall) instead of pages",
    preference: Preferences.infiniteScrollEnabled,
    hotkey: "",
    event: Events.poolItems.infiniteScrollToggled
  },
  {
    id: "show-remove-favorites-buttons",
    parentId: "favorites-options-left",
    textContent: "Remove Buttons",
    title: "Toggle remove favorites buttons",
    enabled: USER_IS_ON_THEIR_OWN_POOL_PAGE,
    preference: Preferences.removeButtonsVisible,
    hotkey: "R",
    function: toggleAddOrRemoveButtons,
    event: Events.poolItems.removeButtonsToggled
  },
  {
    id: "show-add-favorites-buttons",
    parentId: "favorites-options-left",
    textContent: "Add Favorite Buttons",
    title: "Toggle add favorites buttons",
    enabled: !USER_IS_ON_THEIR_OWN_POOL_PAGE,
    preference: Preferences.addButtonsVisible,
    function: toggleAddOrRemoveButtons,
    hotkey: "R",
    event: Events.poolItems.addButtonsToggled
  },
  {
    id: "show-download-buttons",
    parentId: "favorites-options-left",
    textContent: "Download Buttons",
    title: "Toggle download buttons",
    enabled: true,
    preference: Preferences.downloadButtonsVisible,
    hotkey: "",
    function: toggleDownloadButtons,
    event: Events.poolItems.downloadButtonsToggled
  },
  {
    id: "exclude-blacklist",
    parentId: "favorites-options-left",
    textContent: "Exclude Blacklist",
    title: "Exclude poolItems with blacklisted tags from search",
    enabled: USER_IS_ON_THEIR_OWN_POOL_PAGE,
    preference: Preferences.excludeBlacklistEnabled,
    hotkey: "",
    event: Events.poolItems.blacklistToggled
  },
  {
    id: "enable-autoplay",
    parentId: "favorites-options-left",
    textContent: "Autoplay",
    title: "Enable autoplay in gallery",
    enabled: GALLERY_ENABLED,
    preference: Preferences.autoplayActive,
    hotkey: "",
    event: Events.poolItems.autoplayToggled
  },
  {
    id: "toggle-header",
    parentId: "favorites-options-left",
    textContent: "Header",
    title: "Toggle site header",
    preference: Preferences.headerEnabled,
    hotkey: "",
    enabled: false,
    event: Events.poolItems.headerToggled,
    triggerOnCreation: true,
    function: toggleHeader
  },
  {
    id: "dark-theme",
    parentId: "favorites-options-left",
    textContent: "Dark Theme",
    title: "Toggle dark theme",
    defaultValue: usingDarkTheme(),
    hotkey: "",
    event: Events.poolItems.darkThemeToggled,
    function: toggleDarkTheme
  },
  {
    id: "enhance-search-pages",
    parentId: "favorites-options-left",
    textContent: "Search Page Gallery",
    title: "Enable gallery and other features on search pages",
    preference: Preferences.searchPagesEnabled,
    hotkey: "",
    savePreference: true
  },
  {
    id: "sort-ascending",
    parentId: "sort-inputs",
    position: "beforeend",
    enabled: true,
    preference: Preferences.sortAscendingEnabled,
    event: Events.poolItems.sortAscendingToggled
  },
  {
    id: "mobile-gallery",
    parentId: "favorites-options-left",
    textContent: "Gallery",
    title: "Enable gallery",
    position: "beforeend",
    enabled: true,
    preference: Preferences.mobileGalleryEnabled
  }
];

const SELECTS: (Partial<SelectElement<Layout>> | Partial<SelectElement<number>> | Partial<SelectElement<MetadataMetric>> | Partial<SelectElement<PerformanceProfile>>)[] = [
  {
    id: "sorting-method",
    parentId: "sort-inputs",
    title: "Change sorting order of search results",
    position: "beforeend",
    preference: Preferences.sortingMethod,
    event: Events.poolItems.sortingMethodChanged,
    options: new Map<MetadataMetric, string>([
      ["default", "Default"],
      ["score", "Score"],
      ["width", "Width"],
      ["height", "Height"],
      ["creationTimestamp", "Date Uploaded"],
      ["lastChangedTimestamp", "Date Changed"],
      ["id", "ID"],
      ["random", "Random"],
      ["duration", "Duration"]
    ])
  },
  {
    id: "layout-select",
    parentId: "layout-container",
    title: "Change layout",
    position: "beforeend",
    preference: Preferences.poolItemsLayout,
    event: Events.poolItems.layoutChanged,
    function: hideUnusedLayoutSizer,
    options: new Map<Layout, string>([
      ["column", "Waterfall"],
      ["row", "River"],
      ["square", "Square"],
      ["grid", "Legacy"]
      // ["native", "Native"]
    ])
  },
  {
    id: "results-per-page", parentId: "results-per-page-container",
    title: "Change results per page",
    position: "beforeend",
    triggerOnCreation: true,
    preference: Preferences.resultsPerPage,
    event: Events.poolItems.resultsPerPageChanged,
    options: new Map<number, string>([
      [5, "5"],
      [10, "10"],
      [20, "20"],
      [50, "50"],
      [100, "100"],
      [200, "200"],
      [500, "500"],
      [1000, "1000"]
    ])
  },
  {
    id: "column-count",
    parentId: "column-count-container",
    position: "beforeend",
    preference: Preferences.columnCount,
    triggerOnCreation: true,
    event: Events.poolItems.columnCountChanged,
    options: new Map<number, string>([
      [1, "1"],
      [2, "2"],
      [3, "3"],
      [4, "4"],
      [5, "5"],
      [6, "6"],
      [7, "7"],
      [8, "8"],
      [9, "9"],
      [10, "10"]
    ])
  },
  {
    id: "row-size",
    parentId: "row-size-container",
    position: "beforeend",
    preference: Preferences.rowSize,
    triggerOnCreation: true,
    event: Events.poolItems.rowSizeChanged,
    options: new Map<number, string>([
      [1, "1"],
      [2, "2"],
      [3, "3"],
      [4, "4"],
      [5, "5"],
      [6, "6"],
      [7, "7"]
    ])
  }
];

function createButtons(): void {
  for (const button of prepareDynamicElements(BUTTONS)) {
    createButtonElement(button);
  }
}

function createToggleSwitches(): void {
  for (const checkbox of prepareDynamicElements(TOGGLE_SWITCHES)) {
    createToggleSwitch(checkbox);
  }
}

function createSelects(): void {
  // @ts-expect-error don't care
  for (const select of prepareDynamicElements(SELECTS)) {
    createSelectElement(select);
  }
}

export function createDynamicPoolItemsMobileMenuElements(): void {
  createSelects();
  createToggleSwitches();
  createButtons();
}
