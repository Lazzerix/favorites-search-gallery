import { isUserIsOnTheirOwnFavoritesPage } from "../../../utils/misc/favorites_page_metadata";
import {isUserIsOnTheirOwnPoolPage} from "../../../utils/misc/pool_items_page_metadata";

export const ON_SEARCH_PAGE = location.href.includes("page=post&s=list");
export const ON_FAVORITES_PAGE = location.href.includes("page=favorites");
export const ON_POOL_ITEMS_PAGE = location.href.includes("page=pool&s=show");
export const ON_POST_PAGE = location.href.includes("page=post&s=view");
export const USING_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");
export const ON_MOBILE_DEVICE = (/iPhone|iPad|iPod|Android/i).test(navigator.userAgent);
export const ON_DESKTOP_DEVICE = !ON_MOBILE_DEVICE;
export const USER_IS_ON_THEIR_OWN_FAVORITES_PAGE = isUserIsOnTheirOwnFavoritesPage();
export const USER_IS_ON_THEIR_OWN_POOL_PAGE = isUserIsOnTheirOwnPoolPage();
