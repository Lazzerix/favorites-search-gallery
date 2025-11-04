import * as PoolItemsDatabase from "./pool_items_database";
import * as PoolItemsFetcher from "./pool_items_fetcher";
import { PoolItem } from "../../types/pool_item/pool_item";

let allPoolItems: PoolItem[] = [];
let useSearchSubset = false;
let subsetPoolItems: PoolItem[] = [];

function getAllFavoriteIds(): Set<string> {
  return new Set(Array.from(allPoolItems.values()).map(favorite => favorite.id));
}

export async function loadAllPoolItemsFromDatabase(): Promise<PoolItem[]> {
  allPoolItems = await PoolItemsDatabase.loadAllPoolItems();
  return allPoolItems;
}

export function fetchAllPoolItems(onPoolItemsFound: (poolItems: PoolItem[]) => void): Promise<void> {
    console.log("fetchAllPoolItems Start");
  const onPoolItemsFoundHelper = (poolItems: PoolItem[]): void => {
    allPoolItems = allPoolItems.concat(poolItems);
    return onPoolItemsFound(poolItems);
  };
    console.log("fetchAllPoolItems End");
  return PoolItemsFetcher.fetchAllPoolItems(onPoolItemsFoundHelper);
}

export async function fetchNewPoolItemsOnReload(): Promise<PoolItem[]> {
  const newPoolItems = await PoolItemsFetcher.fetchNewPoolItemsOnReload(getAllFavoriteIds());

  allPoolItems = newPoolItems.concat(allPoolItems);
  return newPoolItems;
}

export function getAllPoolItems(): PoolItem[] {
  return useSearchSubset ? subsetPoolItems : allPoolItems;
}

export function storeAllPoolItems(): Promise<void> {
  return PoolItemsDatabase.storePoolItems(allPoolItems);
}

export function storeNewPoolItems(newPoolItems: PoolItem[]): Promise<void> {
  return PoolItemsDatabase.storePoolItems(newPoolItems);
}

export function updateMetadata(id: string): void {
  PoolItemsDatabase.updateMetadata(id);
}

export function deleteFavorite(id: string): Promise<void> {
  return PoolItemsDatabase.deleteFavorite(id);
}

export function setSearchSubset(searchResults: PoolItem[]): void {
  useSearchSubset = true;
  subsetPoolItems = searchResults;
}

export function stopSearchSubset(): void {
  useSearchSubset = false;
  subsetPoolItems = [];
}

export function deleteDatabase(): void {
  PoolItemsDatabase.deleteDatabase();
}
