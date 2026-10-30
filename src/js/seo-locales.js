(() => {
  if (!/^https?:$/.test(location.protocol)) return;
  const siteRoot = new URL("./", document.baseURI);
  for (const [language, path] of [
    ["uk", "./"],
    ["es", "es/"],
    ["en", "en/"],
    ["x-default", "./"],
  ]) {
    const alternateLink = document.createElement("link");
    alternateLink.rel = "alternate";
    alternateLink.hreflang = language;
    alternateLink.href = new URL(path, siteRoot).href;
    document.head.append(alternateLink);
  }
})();
