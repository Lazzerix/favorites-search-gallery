import { DESKTOP_HTML, FAVORITES_HTML, MOBILE_HTML } from "../../../../assets/html";
import { ON_DESKTOP_DEVICE, ON_MOBILE_DEVICE } from "../../../../lib/global/flags/intrinsic_flags";
import { createFooter, moveStatusToFooter } from "./pool_items_mobile_footer";
import { insertHTMLAndExtractStyle, insertStyleHTML } from "../../../../utils/dom/style";
import { FAVORITES_SEARCH_GALLERY_CONTAINER } from "../../../../lib/global/container";
import { createControlsGuide } from "./pool_items_mobile_control_guide";
import { createDynamicPoolItemsDesktopMenuElements } from "../components/dynamic/pool_items_desktop_dynamic_elements";
import { createDynamicPoolItemsMobileMenuElements } from "../components/dynamic/pool_items_mobile_dynamic_elements";
import { createStaticPoolItemsMenuElements } from "../components/static/pool_items_menu_static_element_creator";

export function buildPoolItemsMenu(): void {
  insertPoolItemsMenuHTML();

  if (ON_DESKTOP_DEVICE) {
    buildDesktopPoolItemsMenu();
  } else {
    buildMobilePoolItemsMenu();
  }
  createStaticPoolItemsMenuElements();
}

function insertPoolItemsMenuHTML(): void {
  insertStyleHTML(ON_MOBILE_DEVICE ? MOBILE_HTML : DESKTOP_HTML, "poolItems-menu-style");
  insertHTMLAndExtractStyle(FAVORITES_SEARCH_GALLERY_CONTAINER, "afterbegin", FAVORITES_HTML);
}

function buildDesktopPoolItemsMenu(): void {
  createDynamicPoolItemsDesktopMenuElements();
}

function buildMobilePoolItemsMenu(): void {
  createFooter();
  moveStatusToFooter();
  createControlsGuide();
  createDynamicPoolItemsMobileMenuElements();
}
