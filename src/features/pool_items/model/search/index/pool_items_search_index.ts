import { DO_NOTHING, sleep } from "../../../../../utils/misc/async";
import { BatchExecutor } from "../../../../../lib/components/batch_executor";
import { InvertedSearchIndex } from "./inverted_search_index";
import { PoolItem } from "../../../types/pool_item/pool_item";
import { PoolItemsSettings } from "../../../../../config/pool_items_settings";
import { ThrottledQueue } from "../../../../../lib/components/throttled_queue";
import { splitIntoChunks } from "../../../../../utils/collection/array";

const BATCH_SIZE = 750;
const BATCH_SLEEP_TIME = 0;

class PoolItemsSearchIndex extends InvertedSearchIndex<PoolItem> {
  public ready: boolean = false;
  private asyncBuildStarted: boolean = false;
  private batchExecutor: BatchExecutor<PoolItem> = new BatchExecutor<PoolItem>(BATCH_SIZE, 100, this.addBatch.bind(this));
  private addQueue: ThrottledQueue = new ThrottledQueue(BATCH_SLEEP_TIME);
  private asyncItemsToAdd: Set<PoolItem> = new Set<PoolItem>();
  private cachedAsyncItemsToAdd: PoolItem[] = [];

  constructor() {
    super();

    if (!PoolItemsSettings.useSearchIndex) {
      this.add = DO_NOTHING;
      return;
    }

    if (PoolItemsSettings.buildIndexAsynchronously) {
      this.add = this.cacheAdditionsWhilePoolItemsAreLoading;
      return;
    }
    this.ready = true;
  }

  public async buildIndexAsynchronously(): Promise<void> {
    if (!PoolItemsSettings.useSearchIndex || this.asyncBuildStarted) {
      return;
    }
    this.asyncBuildStarted = true;
    await sleep(50);
    this.keepIndexedTagsSorted(false);
    this.add = this.addAsynchronously;
    this.emptyAdditionsCache();
  }

  public buildIndexSynchronously(): void {
    this.add = super.add;
    this.ready = true;
  }

  private emptyAdditionsCache(): void {
    const chunks = splitIntoChunks(this.cachedAsyncItemsToAdd, BATCH_SIZE);

    for (const chunk of chunks) {
      for (const item of chunk) {
        this.asyncItemsToAdd.add(item);
      }
    }

    for (const chunk of chunks) {
      this.addBatch(chunk);
    }
  }

  private cacheAdditionsWhilePoolItemsAreLoading(item: PoolItem): void {
    this.cachedAsyncItemsToAdd.push(item);
  }

  private addAsynchronously(item: PoolItem): void {
    this.ready = false;
    this.asyncItemsToAdd.add(item);
    this.batchExecutor.add(item);
  }

  private async addBatch(batch: PoolItem[]): Promise<void> {
    await this.addQueue.wait();

    for (const item of batch) {
      super.add(item);
      this.asyncItemsToAdd.delete(item);
    }
    this.ready = this.asyncItemsToAdd.size === 0;

    if (this.ready) {
      this.add = super.add;
      this.keepIndexedTagsSorted(true);
      this.sortTags();
    }
  }
}

export const POOL_ITEMS_SEARCH_INDEX: PoolItemsSearchIndex = new PoolItemsSearchIndex();
