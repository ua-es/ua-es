(() => {
  const handledImages = new WeakSet();

  function handleImageError(image) {
    if (!(image instanceof HTMLImageElement) || !image.getAttribute("src")) return;
    const pictureSource =
      image.parentElement?.tagName === "PICTURE" && image.parentElement.querySelector("source");
    if (pictureSource) {
      pictureSource.remove();
      return;
    }
    if (!handledImages.has(image)) {
      handledImages.add(image);
      const imageUrl = new URL(image.currentSrc || image.src, location.href);
      if (imageUrl.origin !== location.origin) return;
      imageUrl.searchParams.set("image-retry", String(Date.now()));
      image.loading = "eager";
      image.src = imageUrl.href;
      return;
    }
    if (
      image.id === "large-photo" ||
      image.closest('[aria-hidden="true"]') ||
      image.matches(".deco,.heading-art,.popup-art") ||
      image.nextElementSibling?.classList.contains("image-load-error")
    )
      return;
    const errorMessage = document.createElement("span");
    errorMessage.className = "image-load-error";
    errorMessage.textContent = window.i18n.t("image.loadError");
    errorMessage.setAttribute("role", "status");
    image.insertAdjacentElement("afterend", errorMessage);
  }

  document.addEventListener("error", (event) => handleImageError(event.target), true);
  document.addEventListener(
    "load",
    (event) => {
      const image = event.target;
      if (
        image instanceof HTMLImageElement &&
        image.nextElementSibling?.classList.contains("image-load-error")
      ) {
        image.nextElementSibling.remove();
      }
    },
    true
  );

  function checkAlreadyLoadedImages() {
    document.querySelectorAll("img[src]").forEach((image) => {
      if (image.complete && !image.naturalWidth) handleImageError(image);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAlreadyLoadedImages, { once: true });
  } else {
    checkAlreadyLoadedImages();
  }
})();
