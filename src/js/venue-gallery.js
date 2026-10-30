(() => {
  const gallery = document.querySelector(".venue-gallery");
  if (!gallery) return;

  const track = gallery.querySelector(".venue-track");
  const photos = [...gallery.querySelectorAll(".venue-photo")];
  const caption = gallery.querySelector(".venue-caption");
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activePhotoIndex = 0;
  let previouslyFocusedPhoto = null;

  gallery.querySelectorAll("[data-venue-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
      const nextIndex =
        (currentIndex + Number(button.dataset.venueStep) + photos.length) % photos.length;
      track.scrollTo({
        left: nextIndex * track.clientWidth,
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    });
  });

  track.addEventListener(
    "scroll",
    () => {
      const visibleIndex = Math.min(
        photos.length - 1,
        Math.round(track.scrollLeft / track.clientWidth)
      );
      caption.textContent = photos[visibleIndex].querySelector("img").alt;
    },
    { passive: true }
  );

  const lightbox = document.createElement("dialog");
  lightbox.className = "venue-lightbox";
  lightbox.setAttribute("aria-label", window.i18n.t("venueGallery.dialogLabel"));
  lightbox.innerHTML = `<button type="button" class="venue-lightbox-close" aria-label="${window.i18n.t("venueGallery.close")}">×</button><img class="venue-lightbox-image" alt=""><p class="venue-lightbox-caption"></p><div class="venue-lightbox-controls"><button type="button" data-step="-1" aria-label="${window.i18n.t("venueGallery.previous")}">←</button><span class="venue-lightbox-counter" role="status" aria-live="polite"></span><button type="button" data-step="1" aria-label="${window.i18n.t("venueGallery.next")}">→</button></div>`;
  document.body.append(lightbox);

  function renderLightboxPhoto() {
    const sourceImage = photos[activePhotoIndex].querySelector("img");
    const lightboxImage = lightbox.querySelector(".venue-lightbox-image");
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt;
    lightbox.querySelector(".venue-lightbox-caption").textContent = sourceImage.alt;
    lightbox.querySelector(".venue-lightbox-counter").textContent =
      `${activePhotoIndex + 1} / ${photos.length}`;
  }

  function moveLightboxPhoto(step) {
    activePhotoIndex = (activePhotoIndex + step + photos.length) % photos.length;
    renderLightboxPhoto();
  }

  lightbox.querySelector(".venue-lightbox-close").addEventListener("click", () => {
    lightbox.close();
  });
  lightbox.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => moveLightboxPhoto(Number(button.dataset.step)));
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    moveLightboxPhoto(event.key === "ArrowRight" ? 1 : -1);
  });
  lightbox.addEventListener("close", () => previouslyFocusedPhoto?.focus());
  photos.forEach((photo, index) => {
    photo.addEventListener("click", () => {
      activePhotoIndex = index;
      previouslyFocusedPhoto = photo;
      renderLightboxPhoto();
      lightbox.showModal();
    });
  });
})();
