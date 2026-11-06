(() => {
  const legalParagraphCount = { privacy: 3, cookies: 3, terms: 4 };

  function createDialog(dialogId, title) {
    const dialog = document.createElement("dialog");
    dialog.id = dialogId;
    dialog.setAttribute("aria-labelledby", `${dialogId}-title`);
    dialog.className = "legal-dialog";
    dialog.innerHTML = `<button class="mobile-nav-close" type="button" aria-label="${window.i18n.t("page.close")}">×</button><h2 id="${dialogId}-title"></h2><div class="dialog-content"></div>`;
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
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
    document.body.append(dialog);
    return dialog;
  }
  const legalDialog = createDialog("legal-modal", window.i18n.t("page.privacy"));
  function openLegalDialog(section) {
    legalDialog.querySelector("h2").textContent = window.i18n.t(`page.${section}`);
    const content = legalDialog.querySelector(".dialog-content");
    content.replaceChildren();

    for (let number = 1; number <= legalParagraphCount[section]; number++) {
      const heading = document.createElement("h3");
      heading.textContent = window.i18n.t(`legal.${section}.title.${number}`);
      content.append(heading);

      const paragraphElement = document.createElement("p");
      paragraphElement.textContent = window.i18n.t(`legal.${section}.text.${number}`);
      content.append(paragraphElement);
    }

    const externalLink = document.createElement("a");
    externalLink.href = "https://www.aepd.es/";
    externalLink.textContent = "AEPD";
    externalLink.target = "_blank";
    externalLink.rel = "noopener";
    content.append(externalLink);
    legalDialog.showModal();
  }
  document.querySelectorAll("[data-legal]").forEach((link) => {
    link.addEventListener("click", () => openLegalDialog(link.dataset.legal));
  });

  const cookieNotice = document.createElement("aside");
  cookieNotice.className = "cookie-note";
  cookieNotice.setAttribute("aria-label", window.i18n.t("page.cookies"));
  const noticeText = document.createElement("p");
  noticeText.textContent = window.i18n.t("page.notice");
  cookieNotice.append(noticeText);
  for (const [label, onClick] of [
    [window.i18n.t("page.cookies"), () => openLegalDialog("cookies")],
    [
      window.i18n.t("page.ok"),
      () => {
        cookieNotice.hidden = true;
        try {
          sessionStorage.setItem("meetups-storage-notice", "seen");
        } catch {}
      },
    ],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    cookieNotice.append(button);
  }
  try {
    cookieNotice.hidden = sessionStorage.getItem("meetups-storage-notice") === "seen";
  } catch {}
  document.body.append(cookieNotice);

  const navigation = document.querySelector("#navigation");
  const menuButton = document.querySelector(".menu-button");
  if (navigation && menuButton) {
    const mobileNavigation = createDialog("mobile-navigation", window.i18n.t("page.nav"));
    const navigationCopy = navigation.cloneNode(true);
    navigationCopy.removeAttribute("id");
    mobileNavigation.querySelector(".dialog-content").append(navigationCopy);
    navigationCopy.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => mobileNavigation.close());
    });

    menuButton.setAttribute("aria-controls", "mobile-navigation");
    menuButton.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        mobileNavigation.showModal();
        menuButton.setAttribute("aria-expanded", "true");
      },
      true
    );
    mobileNavigation.addEventListener("close", () => {
      menuButton.setAttribute("aria-expanded", "false");
    });
  }

  const eventCountdown = document.querySelector(".event-countdown");
  if (eventCountdown) {
    const eventDate = { date: eventCountdown.dataset.eventLabel };
    const eventDialog = createDialog("planned-event-modal", window.i18n.t("page.date", eventDate));
    eventDialog.querySelector(".dialog-content").textContent = window.i18n.t(
      "page.event",
      eventDate
    );
    document.addEventListener(
      "click",
      (event) => {
        if (!event.target.closest('[data-info="event"]')) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        eventDialog.showModal();
      },
      true
    );
  }

  const photoCaption = document.querySelector("#photo-caption");
  const largePhoto = document.querySelector("#large-photo");
  if (photoCaption && largePhoto) {
    const photoStory = document.createElement("p");
    photoStory.className = "photo-story";
    function updatePhotoStory() {
      const imageSource = largePhoto.getAttribute("src") || "";
      const photoIndex = Number(imageSource.match(/meeting-(\d+)/)?.[1] || 0);
      photoStory.textContent = window.i18n.t(`photoStory.${(photoIndex % 3) + 1}`);
    }

    photoCaption.after(photoStory);
    updatePhotoStory();
    new MutationObserver(updatePhotoStory).observe(largePhoto, {
      attributes: true,
      attributeFilter: ["src"],
    });
  }
})();
