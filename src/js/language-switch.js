const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const themeLabels = {
      uk: ["Увімкнути нічну тему", "Увімкнути денну тему"],
      en: ["Switch to dark theme", "Switch to light theme"],
      es: ["Activar el tema oscuro", "Activar el tema claro"],
    },
    moonIcon = '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
    sunIcon =
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';

  function updateThemeButton() {
    const isNightTheme = document.documentElement.dataset.theme === "night";
    const label = (themeLabels[document.documentElement.lang] || themeLabels.uk)[
      isNightTheme ? 1 : 0
    ];

    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.removeAttribute("aria-pressed");
    themeButton.innerHTML = `<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${
      isNightTheme ? sunIcon : moonIcon
    }</svg>`;
  }

  updateThemeButton();
  themeButton.addEventListener("click", () => {
    window.picnicTheme?.set(document.documentElement.dataset.theme === "night" ? "day" : "night");
    updateThemeButton();
  });

  new MutationObserver(updateThemeButton).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

const language = document.querySelector("#language-choice");
if (language) {
  const languagePages = {
    uk: "index.html",
    es: "es/index.html",
    en: "en/index.html",
  };

  language.addEventListener("change", () => {
    const page = languagePages[language.value];
    if (!page) return;

    const destination = new URL(page, document.baseURI);
    destination.hash = location.hash;
    location.assign(destination.href);
  });
}

document.querySelectorAll(".language-switch a").forEach((link) => {
  link.addEventListener("click", () => {
    const destination = new URL(link.href, location.href);
    destination.hash = location.hash;
    link.href = destination.href;
  });
});
