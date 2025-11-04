import * as Extensions from "../../../../../lib/global/extensions";
import * as PoolItemsModel from "../../../model/pool_items_model";

export function resetPoolItems(): void {
  PoolItemsModel.deleteDatabase();
  Extensions.deleteExtensionsDatabase();
}
