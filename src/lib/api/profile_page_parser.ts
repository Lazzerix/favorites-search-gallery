const PARSER = new DOMParser();

export function extractFavoritesCount(html: string): number {
  const favoritesURL = Array.from(PARSER.parseFromString(html, "text/html").querySelectorAll("a"))
    .find(a => a.href.includes("page=favorites&s=view"));

  if (favoritesURL === undefined || favoritesURL.textContent === null) {
    return 0;
  }
  return parseInt(favoritesURL.textContent);
}

export function extractPoolSize(html: string): number {
    const favoritesURL = Array.from(PARSER.parseFromString(html, "text/html").querySelectorAll("input"));
    let maxValue = 0;

    for (let i = 0; i < favoritesURL.length; i += 1) {
        if (!Number(favoritesURL[i].value)) {
            continue;
        }

        if (maxValue + 1 === Number(favoritesURL[i].value)) {
            maxValue = Number(favoritesURL[i].value);
        }
    }
    return maxValue;
}
