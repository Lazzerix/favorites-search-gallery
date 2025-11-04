import { sleep } from "../../../../utils/misc/async";
import { waitForDOMToLoad } from "../../../../utils/dom/dom";

function clearOriginalPoolViewerContent(): void {
    document.querySelector("#content, div:has(.pool-show)")?.remove();
    document.querySelector("div > p")?.remove();
    document.querySelector("br")?.remove();
    document.querySelector("br")?.remove();
    document.querySelector("br")?.remove();
}

function removeUnusedPoolViewerPageScripts(): void {
  for (const script of document.querySelectorAll("script")) {
    if ((/(?:fluidplayer|awesomplete)/).test(script.src ?? "")) {
      script.remove();
    }
  }
}

export async function cleanOriginalPoolItemsPage(): Promise<void> {
    await waitForDOMToLoad();
    await sleep(20);
    clearOriginalPoolViewerContent();
    removeUnusedPoolViewerPageScripts();
}
