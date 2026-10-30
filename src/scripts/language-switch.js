const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const labels = { uk: ["Увімкнути нічну тему", "Увімкнути денну тему"], en: ["Switch to dark theme", "Switch to light theme"], es: ["Activar el tema oscuro", "Activar el tema claro"] };
  const moon = '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>';
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
  const sync = () => {
    const night = document.documentElement.dataset.theme === "night";
    const label = (labels[document.documentElement.lang] || labels.uk)[night ? 1 : 0];
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.removeAttribute("aria-pressed");
    themeButton.innerHTML = '<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (night ? sun : moon) + "</svg>";
  };
  sync();
  themeButton.addEventListener("click", () => {
    window.picnicTheme?.set(document.documentElement.dataset.theme === "night" ? "day" : "night");
    sync();
  });
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}
const language = document.querySelector("#language-choice");
if (language) language.addEventListener("change", () => {
  const pages = { uk: "index.html", es: "index-es.html", en: "index-en.html" };
  const target = new URL(pages[language.value], location.href);
  target.hash = location.hash;
  location.assign(target.href);
});
document.querySelectorAll(".language-switch a").forEach((link) => link.addEventListener("click", () => {
  const target = new URL(link.href, location.href);
  target.hash = location.hash;
  link.href = target.href;
}));
