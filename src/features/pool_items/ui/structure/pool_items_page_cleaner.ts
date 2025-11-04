import { sleep } from "../../../../utils/misc/async";
import { waitForDOMToLoad } from "../../../../utils/dom/dom";

function getOriginalPoolItemsContent(): HTMLElement | null {
  return document.querySelector("#content, div:has(.thumb)");
}

function clearOriginalPoolItemsContent(): void {
  getOriginalPoolItemsContent()?.remove();
}

function removeUnusedPoolItemsPageScripts(): void {
  for (const script of document.querySelectorAll("script")) {
    if ((/(?:fluidplayer|awesomplete)/).test(script.src ?? "")) {
      script.remove();
    }
  }
}

export async function cleanOriginalPoolItemsPage(): Promise<void> {
  await waitForDOMToLoad();
  await sleep(20);
  clearOriginalPoolItemsContent();
  removeUnusedPoolItemsPageScripts();
}
