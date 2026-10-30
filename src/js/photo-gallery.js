(() => {
  function initialize({ photos, showDialog }) {
    if (!Array.isArray(photos) || photos.length === 0) {
      throw new Error("The photo gallery requires at least one photo.");
    }

    const image = document.querySelector("#large-photo");
    const status = document.querySelector("#photo-status");
    const retryButton = document.querySelector("#photo-retry");
    const caption = document.querySelector("#photo-caption");
    const dialog = document.querySelector("#photo-modal");
    const previousButton = document.querySelector("#photo-prev");
    const nextButton = document.querySelector("#photo-next");
    const requiredElements = [
      image,
      status,
      retryButton,
      caption,
      dialog,
      previousButton,
      nextButton,
    ];

    if (requiredElements.some((element) => !element)) {
      throw new Error("The photo gallery markup is incomplete.");
    }

    let activeIndex = 0;
    let touchStart;

    function renderPhoto(forceRetry = false) {
      const photo = photos[activeIndex];
      status.hidden = false;
      status.textContent = window.i18n.t("gallery.loading");
      retryButton.hidden = true;
      image.setAttribute("aria-busy", "true");
      image.alt = photo.alt;
      image.src = photo.src + (forceRetry ? `?retry=${Date.now()}` : "");
      caption.textContent = `${photo.caption} · ${window.i18n.t("gallery.counter", {
        current: activeIndex + 1,
        total: photos.length,
      })}`;
    }

    function movePhoto(direction) {
      activeIndex = (activeIndex + direction + photos.length) % photos.length;
      renderPhoto();
    }

    image.addEventListener("load", () => {
      image.removeAttribute("aria-busy");
      status.hidden = true;
      retryButton.hidden = true;
    });

    image.addEventListener("error", () => {
      image.removeAttribute("aria-busy");
      status.hidden = false;
      status.textContent = window.i18n.t("gallery.failed");
      retryButton.hidden = false;
    });

    retryButton.addEventListener("click", () => renderPhoto(true));
    image.addEventListener(
      "touchstart",
      (event) => {
        touchStart = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
      },
      { passive: true }
    );
    image.addEventListener(
      "touchend",
      (event) => {
        if (!touchStart) return;

        const horizontalDistance = event.changedTouches[0].clientX - touchStart[0];
        const verticalDistance = event.changedTouches[0].clientY - touchStart[1];
        if (
          Math.abs(horizontalDistance) > 60 &&
          Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.5
        ) {
          movePhoto(horizontalDistance < 0 ? 1 : -1);
        }
        touchStart = null;
      },
      { passive: true }
    );

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const photoButton = event.target.closest("[data-photo]");
      if (!photoButton) return;

      const requestedIndex = Number(photoButton.dataset.photo);
      if (
        !Number.isInteger(requestedIndex) ||
        requestedIndex < 0 ||
        requestedIndex >= photos.length
      ) {
        return;
      }

      activeIndex = requestedIndex;
      renderPhoto();
      showDialog(dialog);
    });

    previousButton.addEventListener("click", () => movePhoto(-1));
    nextButton.addEventListener("click", () => movePhoto(1));
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previousButton.click();
      if (event.key === "ArrowRight") nextButton.click();
    });
  }

  window.picnicPhotoGallery = Object.freeze({ initialize });
})();
