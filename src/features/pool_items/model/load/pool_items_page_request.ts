import { POOL_ITEMS_PER_PAGE } from "../../../../lib/global/constants";
import { PoolItem } from "../../types/pool_item/pool_item";
import { PoolItemsSettings } from "../../../../config/pool_items_settings";
import { createPoolPageURL } from "../../../../lib/api/api_url";

export class PoolItemsPageRequest {
  public readonly pageNumber: number;
  public poolItems: PoolItem[] = [];
  private retryCount: number;

  constructor(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.retryCount = 0;
  }

  public get url(): string {
    return createPoolPageURL(this.pageNumber * POOL_ITEMS_PER_PAGE);
  }

  public get fetchDelay(): number {
    return (7 ** (this.retryCount)) + PoolItemsSettings.poolItemsPageFetchDelay;
  }

  public get realPageNumber(): number {
    return this.pageNumber * POOL_ITEMS_PER_PAGE;
  }

  public retry(): void {
    this.retryCount += 1;
  }
}
