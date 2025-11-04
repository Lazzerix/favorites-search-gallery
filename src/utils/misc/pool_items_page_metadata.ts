import { getCookie } from "../../lib/global/cookie";

export function getUserId(): string {
  return getCookie("user_id", "");
}

export function getPoolItemsPageId(): string | null {
  const match = (/(?:&|\?)id=(\d+)/).exec(window.location.href);
  return match ? match[1] : null;
}
/**
 * todo: check to see if the edit page of a pool load. If so check pool type, if not it is private
 * temporarily overwritten to true
 */
export function isUserIsOnTheirOwnPoolPage(): boolean {
  return true;
}

export function getTagBlacklist(): string {
  let tags = getCookie("tag_blacklist", "") ?? "";

  for (let i = 0; i < 3; i += 1) {
    tags = decodeURIComponent(tags).replace(/(?:^| )-/, "");
  }
  return tags;
}
