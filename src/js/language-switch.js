const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const moonIcon = '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
    sunIcon =
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';

  function updateThemeButton() {
    const isNightTheme = document.documentElement.dataset.theme === "night";
    const label = window.i18n.t(isNightTheme ? "theme.toDay" : "theme.toNight");

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
  language.addEventListener("change", () => {
    const page = language.selectedOptions[0]?.dataset.href;
    if (!page) return;

    // Resolve against site root, not current page, to avoid
    // adding language prefix to the URL (e.g., /ru/en instead of /en)
    const siteRoot = "https://ua-es.github.io/ua-es/";
    const destination = new URL(page, siteRoot);
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
