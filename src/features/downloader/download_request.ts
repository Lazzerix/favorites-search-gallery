import { isGif, isVideo } from "../../utils/content/content_type";
import { Favorite } from "../../types/favorite_types";
import { getExtension } from "../../lib/global/extensions";
import { getOriginalContentURL } from "../../lib/api/api_content";
import {PoolItemRaw} from "../../types/pool_item_types";

export class DownloadRequest {
  public id: string;
  public url: string;
  public extension: string;
  public downloadIndex: number;

  constructor(id: string, url: string, extension: string, downloadIndex: number) {
    this.id = id;
    this.url = url;
    this.extension = extension;
    this.downloadIndex = downloadIndex;
  }

  public get filename(): string {
    return `${this.id}.${this.extension}`;
  }

  public async blob(): Promise<Blob> {
    const response = await fetch(this.url);
    return response.blob();
  }
}

export async function createDownloadRequest(favorite: Favorite, downloadIndex: number): Promise<DownloadRequest> {
  let extension;

  if (isVideo(favorite)) {
    extension = "mp4";
  } else if (isGif(favorite)) {
    extension = "gif";
  } else {
    extension = await getExtension(favorite);
  }
  const url = await getOriginalContentURL(favorite);
  return new DownloadRequest(favorite.id, url, extension, downloadIndex);
}

export async function createDownloadRequestPool(favorite: PoolItemRaw, downloadIndex: number): Promise<DownloadRequest> {
    let extension;

    if (isVideo(favorite)) {
        extension = "mp4";
    } else if (isGif(favorite)) {
        extension = "gif";
    } else {
        extension = await getExtension(favorite);
    }
    const url = await getOriginalContentURL(favorite);
    return new DownloadRequest(favorite.id, url, extension, downloadIndex);
}
