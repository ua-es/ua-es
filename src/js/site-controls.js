(() => {
  const themeChoice = document.querySelector("#theme-choice");
  if (themeChoice) {
    themeChoice.value = window.picnicTheme?.choice || "day";
    themeChoice.addEventListener("change", () => window.picnicTheme?.set(themeChoice.value));
  }

  const menuButton = document.querySelector(".menu-button");
  const header = document.querySelector("header");

  function closeMobileNavigation() {
    header?.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  if (menuButton && header) {
    menuButton.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", closeMobileNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileNavigation();
    });
  }

  const focusBeforeDialog = new WeakMap();

  function showDialog(dialog) {
    if (!dialog.open) {
      focusBeforeDialog.set(dialog, document.activeElement);
      dialog.showModal();
    }
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll("dialog[id]").forEach((dialog) => {
    const closeButton = dialog.querySelector("[data-close]");
    if (!closeButton) return;

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      const anotherDialogIsOpen = document.querySelector("dialog[open]");
      document.body.style.overflow = anotherDialogIsOpen ? "hidden" : "";
      if (!anotherDialogIsOpen) focusBeforeDialog.get(dialog)?.focus();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;

      const bounds = dialog.getBoundingClientRect();
      const clickedOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (clickedOutside) dialog.close();
    });
  });

  const versionMenu = document.querySelector(".version-menu");
  if (versionMenu) {
    document.addEventListener("click", (event) => {
      if (!versionMenu.contains(event.target)) versionMenu.open = false;
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") versionMenu.open = false;
    });
  }

  window.picnicSiteControls = Object.freeze({ showDialog });
})();
