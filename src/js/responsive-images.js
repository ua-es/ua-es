(() => {
  const imageVariants = window.imageVariants || {};

  function getAssetId(imageSource) {
    try {
      const imagePath = new URL(imageSource, location.href).pathname;
      return Object.keys(imageVariants).find((assetId) => {
        const variants = imageVariants[assetId].formats;
        return (
          imagePath.endsWith(`/${assetId}`) ||
          Object.values(variants).some((variantPath) => imagePath.endsWith(`/${variantPath}`))
        );
      });
    } catch {
      return null;
    }
  }

  function enhanceImage(image) {
    const assetId = getAssetId(image.getAttribute("src"));
    if (!assetId) return;

    const variants = imageVariants[assetId];
    let picture = image.parentElement;
    if (picture?.tagName !== "PICTURE") {
      picture = document.createElement("picture");
      picture.className = "responsive-picture";
      image.before(picture);
      picture.append(image);
    }

    const sourcePath = new URL(image.getAttribute("src"), location.href).pathname;
    const alreadyEnhanced =
      picture.dataset.asset === assetId && sourcePath.endsWith(`/${variants.formats.png}`);
    if (alreadyEnhanced) return;

    picture.dataset.asset = assetId;
    picture.querySelectorAll("source").forEach((source) => source.remove());
    for (const format of ["avif", "webp"]) {
      const source = document.createElement("source");
      source.type = `image/${format}`;
      source.srcset = variants.formats[format];
      picture.insertBefore(source, image);
    }

    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.width = variants.size[0];
    image.height = variants.size[1];
    image.decoding = "async";
    if (!image.hasAttribute("loading") && !image.hasAttribute("fetchpriority")) {
      image.loading = image.closest("dialog[open]") ? "eager" : "lazy";
    }
    image.src = variants.formats.png;
  }

  function enhanceImagesIn(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    if (node.matches("img")) enhanceImage(node);
    node.querySelectorAll("img").forEach(enhanceImage);
  }

  enhanceImagesIn(document.documentElement);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        enhanceImage(mutation.target);
      } else {
        mutation.addedNodes.forEach(enhanceImagesIn);
      }
    }
  }).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  window.upgradeImages = enhanceImagesIn;
})();
