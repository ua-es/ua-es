(() => {
  const retried = /* @__PURE__ */ new WeakSet();
  function failed(image) {
    if (!(image instanceof HTMLImageElement) || !image.getAttribute("src")) return;
    if (!retried.has(image)) {
      retried.add(image);
      const url = new URL(image.currentSrc || image.src, location.href);
      if (url.origin !== location.origin) return;
      url.searchParams.set("image-retry", String(Date.now()));
      image.loading = "eager";
      image.src = url.href;
      return;
    }
    if (image.id === "large-photo" || image.closest('[aria-hidden="true"]') || image.matches(".deco,.heading-art,.popup-art")) return;
    if (image.nextElementSibling?.classList.contains("image-load-error")) return;
    const message = document.createElement("span");
    message.className = "image-load-error";
    message.textContent = "No se ha podido cargar la imagen";
    message.setAttribute("role", "status");
    image.insertAdjacentElement("afterend", message);
  }
  document.addEventListener("error", (event) => failed(event.target), true);
  document.addEventListener("load", (event) => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.nextElementSibling?.classList.contains("image-load-error")) image.nextElementSibling.remove();
  }, true);
  function check() {
    const images = [...document.querySelectorAll("img[src]")];
    images.forEach((image) => {
      if (image.complete && !image.naturalWidth) failed(image);
    });

  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", check, { once: true });
  else check();
})();
