import { PoolItem, getPoolItem } from "../../types/pool_item/pool_item";
import { BatchExecutor } from "../../../../lib/components/batch_executor";
import { Database } from "../../../../lib/components/database";
import { PoolItemsDatabaseRecord } from "../../../../types/pool_item_types";
import { convertToTagSet } from "../../../../utils/primitive/string";
import { getPoolItemsPageId } from "../../../../utils/misc/pool_items_page_metadata";

const SCHEMA_VERSION = 1;
const SCHEMA_VERSION_LOCAL_STORAGE_KEY = "poolItemsSearchGallerySchemaVersion";
const DATABASE = new Database<PoolItemsDatabaseRecord>("PoolItems", `pool${getPoolItemsPageId()}`);
const METADATA_UPDATER = new BatchExecutor(100, 1000, updatePoolItems);

function updatePoolItems(poolItems: PoolItem[]): void {
  DATABASE.update(poolItems.map(favorite => favorite.databaseRecord));
}

function convertToPoolItems(records: PoolItemsDatabaseRecord[]): PoolItem[] {
  return records.map(record => new PoolItem(record));
}

function getSchemaVersion(): number | null {
  const version = localStorage.getItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY);
  return version === null ? null : parseInt(version);
}

function isSchemaVersionNull(): boolean {
    const version = localStorage.getItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY);
    return version === null;
}

function setSchemaVersion(version: number): void {
    console.log("setSchemaVersion");
  localStorage.setItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY, version.toString());
}

function usingCorrectSchema(records: PoolItemsDatabaseRecord[]): boolean {
  return getSchemaVersion() === SCHEMA_VERSION && records.length > 0 && records[0].tags instanceof Set;
}

function updateRecord(record: PoolItemsDatabaseRecord): PoolItemsDatabaseRecord {
    return {
    ...record,
    tags: convertToTagSet(record.tags as unknown as string),
    metadata: JSON.parse(record.metadata as unknown as string)
  };
}

function updateRecords(records: PoolItemsDatabaseRecord[]): PoolItemsDatabaseRecord[] {
  return records.map(record => updateRecord(record));
}

async function updateRecordsIfNeeded(records: PoolItemsDatabaseRecord[]): Promise<PoolItemsDatabaseRecord[]> {
  console.log(`updateRecordsIfNeeded isSchemaVersionNull() ${isSchemaVersionNull()}`);
  console.log(`localStorage.getItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY); ${localStorage.getItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY)}`);

  if (isSchemaVersionNull()) {
    setSchemaVersion(SCHEMA_VERSION);
  }

  if (records.length === 0) {
    return Promise.resolve(records);
  }

  if (usingCorrectSchema(records)) {
    return Promise.resolve(records);
  }
  const updatedRecords = updateRecords(records);

  await DATABASE.update(updatedRecords);
  setSchemaVersion(SCHEMA_VERSION);
  return updatedRecords;
}

export async function loadAllPoolItems(): Promise<PoolItem[]> {
  const records = await DATABASE.load();

  const updatedRecords = await updateRecordsIfNeeded(records);
  return convertToPoolItems(updatedRecords);
}

export function storePoolItems(poolItems: PoolItem[]): Promise<void> {
  return DATABASE.store(poolItems.slice().reverse().map(favorite => favorite.databaseRecord));
}

export function updateMetadata(id: string): void {
  const favorite = getPoolItem(id);

  if (favorite !== undefined) {
    METADATA_UPDATER.add(favorite);
  }
}

export function deleteFavorite(id: string): Promise<void> {
  return DATABASE.deleteRecords([id]);
}

export function deleteDatabase(): Promise<void> {
  return DATABASE.delete();
}
