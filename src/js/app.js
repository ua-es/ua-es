import "./countdown.js";
import { initializeContactForm } from "./contact-form.js";

(() => {
  const {
    querySelector,
    querySelectorAll,
    escapeHtml,
    getDishImage,
    getCityImage,
    getCityPreview,
    getCityVenue,
    renderMapPin,
    renderCityCard,
  } = window.picnicAppHelpers;
  const dishDecorations = [
    "decor-rosette",
    "decor-orange-sprig",
    "decor-ceramic-spoon",
    "decor-lemon-blossom",
  ];
  let mapPathDataByRegion = {};
  const primaryCityMapEntries = [
      ["sevilla", true, 570, 736, "andalucia"],
      ["malaga", true, 746, 823, "andalucia"],
      ["torremolinos", true, 729, 831, "andalucia"],
      ["benalmadena", true, 713, 837, "andalucia"],
      ["marbella", true, 661, 850, "andalucia"],
      ["jerez", true, 541, 805, "andalucia"],
      ["valencia", true, 1070, 540, "spain"],
      ["granada", false, 846, 770, "andalucia"],
      ["cordoba", false, 702, 705, "andalucia"],
      ["madrid", false, 790, 461, "spain"],
      ["alicante", false, 1078, 650, "spain"],
      ["asturias", false, 631, 143, "spain"],
      ["fuengirola", false, 695, 843, "andalucia"],
      ["san-pedro", true, 642, 850, "andalucia"],
      ["cadiz", false, 507, 810, "andalucia"],
      ["huelva", false, 473, 746, "andalucia"],
      ["barcelona", false, 1235, 332, "spain"],
      ["portugal", false, 345, 620, "portugal"],
      ["chiclana", false, 523, 835, "andalucia"],
    ],
    cityCoordinates = {
      sevilla: [-5.9845, 37.3891],
      malaga: [-4.4214, 36.7213],
      torremolinos: [-4.4997, 36.6218],
      benalmadena: [-4.5167, 36.5969],
      marbella: [-4.8858, 36.5101],
      jerez: [-6.137, 36.685],
      valencia: [-0.3763, 39.4699],
      granada: [-3.5986, 37.1773],
      cordoba: [-4.7794, 37.8882],
      madrid: [-3.7038, 40.4168],
      alicante: [-0.4907, 38.3452],
      asturias: [-5.8494, 43.3619],
      fuengirola: [-4.625, 36.539],
      "san-pedro": [-4.991, 36.487],
      cadiz: [-6.2886, 36.5271],
      huelva: [-6.9447, 37.2614],
      barcelona: [2.1734, 41.3851],
      portugal: [-8.3, 39.5],
      chiclana: [-6.1494, 36.4194],
    };
  for (const [cityId, longitude, latitude] of [
    ["lisbon", -9.1393, 38.7223],
    ["porto", -8.6291, 41.1579],
    ["faro", -7.9304, 37.0194],
    ["coimbra", -8.4292, 40.2033],
  ]) {
    primaryCityMapEntries.push([cityId, false, 0, 0, "portugal"]);
    cityCoordinates[cityId] = [longitude, latitude];
  }
  const additionalCityMapEntries = [
    ["bilbao", -2.935, 43.263, "spain"],
    ["santander", -3.81, 43.462, "spain"],
    ["santiago", -8.544, 42.879, "spain"],
    ["coruna", -8.411, 43.362, "spain"],
    ["vigo", -8.72, 42.24, "spain"],
    ["leon", -5.567, 42.599, "spain"],
    ["zaragoza", -0.889, 41.649, "spain"],
    ["pamplona", -1.644, 42.813, "spain"],
    ["jaen", -3.79, 37.78, "andalucia"],
    ["almeria", -2.46, 36.84, "andalucia"],
    ["ronda", -5.16, 36.74, "andalucia"],
    ["dos-hermanas", -5.92, 37.28, "andalucia"],
    ["rinconada", -5.98, 37.49, "andalucia"],
    ["nerja", -3.88, 36.75, "andalucia"],
    ["estepona", -5.14, 36.43, "andalucia"],
    ["tarifa", -5.6, 36.01, "andalucia"],
  ];

  for (const [cityId, longitude, latitude, region] of additionalCityMapEntries) {
    primaryCityMapEntries.push([cityId, false, 0, 0, region]);
    cityCoordinates[cityId] = [longitude, latitude];
  }
  const mapCities = primaryCityMapEntries.map(([cityId, isPast, , , region]) => {
    const [longitude, latitude] = cityCoordinates[cityId];
    return {
      id: cityId,
      name: window.i18n.t(`city.name.${cityId}`),
      isPast,
      mapX: (longitude + 10) * 70,
      mapY: (44.5 - latitude) * 94,
      region,
    };
  });
  function renderMapIllustration() {
    const overviewCityIds = [
      "sevilla",
      "malaga",
      "marbella",
      "valencia",
      "madrid",
      "asturias",
      "barcelona",
      "lisbon",
      "porto",
      "bilbao",
    ];
    const visibleCityIds = new Set([
      ...overviewCityIds,
      "granada",
      "cordoba",
      "cadiz",
      "huelva",
      "jerez",
      "almeria",
      "faro",
    ]);
    const coastalCityIds = ["torremolinos", "benalmadena", "fuengirola", "san-pedro", "chiclana"];
    const regions = ["spain", "portugal", "andalucia"];
    const regionIllustrations = regions.map((region) => {
      const regionCities = mapCities.filter(
        (city) => city.region === region && visibleCityIds.has(city.id)
      );
      const cityPins = regionCities
        .map((city) => renderMapPin(city, overviewCityIds, coastalCityIds))
        .join("");
      const mapData = mapPathDataByRegion[region] || "";
      const regionAttribute = region !== "spain" ? `data-map="${region}"` : "";

      return `<div class="geographic-piece piece-${region}"><svg class="map-art" viewBox="0 0 1120 900" aria-hidden="true"><defs><clipPath id="clip-${region}"><path d="${mapData}"/></clipPath></defs><g class="map-region" ${regionAttribute} ${mapData ? `clip-path="url(#clip-${region})"` : ""}><image href="assets/maps/${region}.svg" width="1120" height="900"/></g></svg>${cityPins}</div>`;
    });

    return `<div class="map-coordinate-layer country-view" data-mode="spain" style="aspect-ratio:1120/900">${regionIllustrations.join("")}</div>`;
  }
  const informationDetails = {
      first: {
        layout: "split",
        art: "v6-swallow",
        image: "archive-family",
        tone: "green",
        purpose: "join",
      },
      drinks: {
        layout: "checklist",
        art: "v6-lemon",
        image: "bring-drinks-1280",
        tone: "orange",
        purpose: "question",
      },
      help: {
        layout: "poster",
        art: "v6-olive",
        image: "picnic-trailer-720",
        tone: "green",
        purpose: "help",
      },
      support: {
        layout: "split",
        art: "v6-jug",
        image: "archive-big",
        tone: "blue",
        purpose: "support",
      },
    },
    menuItems = [
      {
        asset: "chicken",
        cat: "base",
        sheet: "main",
        x: 0,
        y: 0,
      },
      {
        asset: "pork",
        cat: "base",
        sheet: "main",
        x: 1,
        y: 0,
      },
      {
        asset: "borscht",
        cat: "base",
        sheet: "main",
        x: 2,
        y: 0,
      },
      {
        asset: "okroshka",
        cat: "base",
        sheet: "main",
        x: 0,
        y: 1,
      },
      {
        asset: "salad",
        cat: "base",
        sheet: "extra",
        x: 2,
        y: 0,
      },
      {
        asset: "olives",
        cat: "base",
        sheet: "extra",
        x: 1,
        y: 1,
      },
      {
        asset: "varenyky",
        cat: "extra",
        sheet: "extra",
        x: 0,
        y: 0,
      },
      {
        asset: "canapes",
        cat: "extra",
        sheet: "extra",
        x: 0,
        y: 1,
      },
      {
        asset: "potatoes",
        cat: "extra",
        sheet: "main",
        x: 1,
        y: 1,
      },
      {
        asset: "pelmeni",
        cat: "extra",
        sheet: "extra",
        x: 1,
        y: 0,
      },
      {
        asset: "sweet-crepes",
        cat: "extra",
        sheet: "main",
        x: 2,
        y: 1,
      },
      {
        asset: "savory-crepes",
        cat: "extra",
        sheet: "main",
        x: 2,
        y: 1,
      },
    ],
    cityDescriptionIds = new Set([
      "sevilla",
      "malaga",
      "torremolinos",
      "marbella",
      "jerez",
      "cordoba",
      "granada",
      "huelva",
      "valencia",
      "benalmadena",
      "madrid",
      "alicante",
      "asturias",
      "portugal",
    ]);
  const galleryPhotos = [
    {
      src: "images/archive-forest.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-forest.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "nature",
      caption: window.i18n.t("gallery.photo.archive-forest.caption"),
    },
    {
      src: "images/archive-beach.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-beach.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "sea",
      caption: window.i18n.t("gallery.photo.archive-beach.caption"),
    },
    {
      src: "images/IMG_8336.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.img-8336.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "table",
      caption: window.i18n.t("gallery.photo.img-8336.caption"),
    },
    {
      src: "images/archive-big.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-big.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "nature",
      caption: window.i18n.t("gallery.photo.archive-big.caption"),
    },
    {
      src: "images/archive-tents.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-tents.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "nature",
      caption: window.i18n.t("gallery.photo.archive-tents.caption"),
    },
    {
      src: "images/IMG_4325.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.img-4325.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "table",
      caption: window.i18n.t("gallery.photo.img-4325.caption"),
    },
    {
      src: "images/archive-family.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-family.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "nature",
      caption: window.i18n.t("gallery.photo.archive-family.caption"),
    },
    {
      src: "images/archive-autumn.webp",
      position: "center",
      alt: window.i18n.t("gallery.photo.archive-autumn.alt"),
      type: "REAL_EVENT_PHOTO",
      category: "nature",
      caption: window.i18n.t("gallery.photo.archive-autumn.caption"),
    },
    ...[
      "sea",
      "sea",
      "park",
      "park",
      "park",
      "park",
      "table",
      "table",
      "park",
      "park",
      "table",
      "park",
      "park",
      "waterfront",
      "park",
      "park",
      "park",
      "park",
      "sea",
      "park",
    ].map((scene, index) => {
      const caption = window.i18n.t(`gallery.scene.${scene}`);
      const photoNumber = String(index + 1).padStart(2, "0");

      return {
        src: `images/community/meeting-${photoNumber}.webp`,
        alt: caption,
        caption,
      };
    }),
  ];
  const { showDialog } = window.picnicSiteControls;
  const openContactForm = initializeContactForm({
    querySelector,
    querySelectorAll,
    isPhoneNumber: window.picnicAppHelpers.isPhoneNumber,
    isValidContactMethod: window.picnicAppHelpers.isValidContactMethod,
    showDialog,
  });
  window.picnicPhotoGallery.initialize({ photos: galleryPhotos, showDialog });
  querySelector("#vote-results").textContent = window.i18n.t("vote.initialStatus");
  querySelector("#vote-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const preferences = [...event.currentTarget.querySelectorAll("select")]
      .map((select) => `${select.name}: ${select.selectedOptions[0]?.textContent || select.value}`)
      .join(" \xB7 ");
    openContactForm("question", window.i18n.t("vote.requestContext", { preferences }));
  });
  const reducedMotionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver;
  function initializeScrollReveals() {
    revealObserver?.disconnect();
    if (reducedMotionPreference.matches || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("motion-enabled");
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
      revealObserver.observe(element);
    });
    document.documentElement.classList.add("motion-enabled");
  }
  initializeScrollReveals();
  reducedMotionPreference.addEventListener("change", initializeScrollReveals);
  const heroSlides = querySelectorAll(".hero-slide");
  const heroSlider = querySelector(".hero-slider");
  let activeHeroSlideIndex = 0;
  let heroAutoplayTimer;
  let isHeroAutoplayPaused = reducedMotionPreference.matches;
  let isHeroVisible = true;
  function preloadHeroImage(slideIndex) {
    const image = querySelector("img", heroSlides[slideIndex]);
    if (!image.dataset.src) return;
    image.loading = "eager";
    image.src = image.dataset.src;
    delete image.dataset.src;
  }
  function showHeroSlide(slideIndex, userInitiated = false) {
    if (userInitiated) updateHeroAutoplay();
    activeHeroSlideIndex = (slideIndex + heroSlides.length) % heroSlides.length;
    preloadHeroImage(activeHeroSlideIndex);
    heroSlides.forEach((slide, index) => {
      slide.hidden = index !== activeHeroSlideIndex;
      slide.classList.toggle("active", index === activeHeroSlideIndex);
    });
    querySelectorAll("[data-slide]").forEach((button, index) =>
      button.setAttribute("aria-current", String(index === activeHeroSlideIndex))
    );
    querySelector("#hero-count").textContent =
      `0${activeHeroSlideIndex + 1} / 0${heroSlides.length}`;
    preloadHeroImage((activeHeroSlideIndex + 1) % heroSlides.length);
  }
  function updateHeroAutoplay() {
    clearInterval(heroAutoplayTimer);
    querySelector("#hero-pause").textContent = isHeroAutoplayPaused ? "▶" : "Ⅱ";
    querySelector("#hero-pause").setAttribute(
      "aria-label",
      isHeroAutoplayPaused ? window.i18n.t("hero.play") : window.i18n.t("hero.pause")
    );
    if (!isHeroAutoplayPaused && isHeroVisible && !document.hidden) {
      heroAutoplayTimer = setInterval(() => showHeroSlide(activeHeroSlideIndex + 1), 8500);
    }
  }
  querySelector("#hero-prev").addEventListener("click", () =>
    showHeroSlide(activeHeroSlideIndex - 1, true)
  );
  querySelector("#hero-next").addEventListener("click", () =>
    showHeroSlide(activeHeroSlideIndex + 1, true)
  );
  querySelectorAll("[data-slide]").forEach((button) =>
    button.addEventListener("click", () => showHeroSlide(Number(button.dataset.slide), true))
  );
  querySelector("#hero-pause").addEventListener("click", () => {
    isHeroAutoplayPaused = !isHeroAutoplayPaused;
    updateHeroAutoplay();
  });
  document.addEventListener("visibilitychange", updateHeroAutoplay);
  reducedMotionPreference.addEventListener("change", () => {
    if (reducedMotionPreference.matches) isHeroAutoplayPaused = true;
    updateHeroAutoplay();
  });
  heroSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showHeroSlide(activeHeroSlideIndex - 1, true);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showHeroSlide(activeHeroSlideIndex + 1, true);
    }
  });
  let heroTouchStart;
  heroSlider.addEventListener(
    "touchstart",
    (event) => {
      heroTouchStart = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    },
    { passive: true }
  );
  heroSlider.addEventListener(
    "touchend",
    (event) => {
      if (!heroTouchStart) return;
      const horizontalDistance = event.changedTouches[0].clientX - heroTouchStart[0];
      const verticalDistance = event.changedTouches[0].clientY - heroTouchStart[1];
      if (
        Math.abs(horizontalDistance) > 65 &&
        Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.5
      ) {
        showHeroSlide(activeHeroSlideIndex + (horizontalDistance < 0 ? 1 : -1), true);
      }
      heroTouchStart = null;
    },
    { passive: true }
  );
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
      updateHeroAutoplay();
    }).observe(heroSlider);
  }
  updateHeroAutoplay();
  if (document.readyState === "complete") {
    preloadHeroImage(1);
  } else {
    window.addEventListener("load", () => preloadHeroImage(1), { once: true });
  }
  function renderCityMap(region) {
    if (!["spain", "andalucia", "portugal"].includes(region)) return;
    const mapCanvas = querySelector("#map-canvas");
    if (!mapCanvas.firstElementChild) mapCanvas.innerHTML = renderMapIllustration();
    const mapLayer = mapCanvas.firstElementChild;
    mapLayer.dataset.mode = region;
    mapLayer.classList.toggle("region-view", region !== "spain");
    querySelectorAll(".geographic-piece").forEach((piece) => {
      piece.inert = region !== "spain" && !piece.classList.contains(`piece-${region}`);
    });
    querySelector("#map-scenery").src =
      `images/v6-map-background-${region === "portugal" ? "spain" : region}.webp`;
    querySelector("#layered-map").classList.toggle("zoomed", region === "andalucia");
    querySelector("#layered-map").scrollLeft = 0;
    querySelector("#map-title").textContent = window.i18n.t(`city.map.title.${region}`);
    querySelectorAll(".map-switch [data-map]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.map === region));
    });
    const visibleCities = mapCities.filter((city) => region === "spain" || city.region === region);
    querySelector("#city-scroller").innerHTML =
      visibleCities.map(renderCityCard).join("") +
      `<button class="city-card add-city" data-contact="question" data-context="${window.i18n.t("city.map.addContext")}"><span class="city-status">${window.i18n.t("city.map.addStatus")}</span><strong>${window.i18n.t("city.map.addTitle")}</strong><span>${window.i18n.t("city.map.addAction")} </span></button>`;
    querySelector("#city-scroller").scrollLeft = 0;
  }
  let mapLoad;
  async function initializeCityMap() {
    if (mapLoad) return mapLoad;
    mapLoad = (async () => {
      try {
        const response = await fetch(new URL("assets/maps/paths.json", document.baseURI));
        if (!response.ok) throw new Error(`Map data: HTTP ${response.status}`);
        mapPathDataByRegion = await response.json();
      } catch (error) {
        console.warn("Map contours unavailable; using the map illustrations.", error);
      }
      renderCityMap("spain");
    })();
    return mapLoad;
  }
  if ("IntersectionObserver" in window) {
    const mapObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        mapObserver.disconnect();
        initializeCityMap();
      },
      { rootMargin: "600px" }
    );
    mapObserver.observe(querySelector("#geography"));
  } else {
    initializeCityMap();
  }
  function openCityDetails(cityId) {
    const city = mapCities.find((item) => item.id === cityId);
    if (!city) return;
    const venue = getCityVenue(cityId);
    const decoration = [
      "orange",
      "swallow",
      "tile-round",
      "fan",
      "lantern",
      "bowl",
      "arch",
      "orange-blossom",
      "sun",
      "balcony",
    ][mapCities.indexOf(city) % 10];
    const description = cityDescriptionIds.has(cityId)
      ? window.i18n.t(`city.dialog.description.${cityId}`)
      : window.i18n.t(city.isPast ? "city.dialog.defaultPast" : "city.dialog.defaultNew");

    querySelector("#city-content").innerHTML = `
      <div class="city-modal-cover">
        <img class="city-hero" src="${getCityImage(cityId)}" alt="${escapeHtml(city.name)}" width="720" height="480">
        <img class="popup-art" src="images/v6-${decoration}.webp" alt="" width="160" height="160">
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${window.i18n.t(city.isPast ? "city.dialog.pastLabel" : "city.dialog.newLabel")}</p>
        <h2 id="city-title">${escapeHtml(city.name)}</h2>
        <p>${escapeHtml(description)}</p>
        ${
          city.isPast
            ? `<div class="city-memory">
                <h3>${window.i18n.t("city.dialog.memoryHeading")}</h3>
                <p>${window.i18n.t("city.dialog.memoryIntro")}</p>
                <p>${window.i18n.t("city.dialog.memoryArchive")}</p>
                <div class="memory-gallery">${[0, 2, 4]
                  .map(
                    (photoIndex) =>
                      `<button data-photo="${photoIndex}" aria-label="${window.i18n.t("city.dialog.memoryArchiveLabel")}"><img src="${galleryPhotos[photoIndex].src}" alt="${escapeHtml(galleryPhotos[photoIndex].alt)}" width="300" height="220" loading="lazy"></button>`
                  )
                  .join("")}</div>
              </div>`
            : ""
        }
        ${
          venue
            ? `<p>${escapeHtml(window.i18n.t("city.dialog.proposedVenue", { venue: venue.name }))}</p>
                <a class="text-link" href="${venue.mapUrl}" target="_blank" rel="noopener">${window.i18n.t("city.dialog.mapAction")}</a>`
            : ""
        }
        <p>${window.i18n.t("city.dialog.invitation")}</p>
        <div class="actions">
          <button class="button" data-vote-city="${city.id}">${window.i18n.t("city.dialog.supportAction")}</button>
          <button class="text-button" data-contact="question" data-context="${escapeHtml(window.i18n.t("city.dialog.contactContext", { city: city.name }))}">${window.i18n.t("city.dialog.joinAction")}</button>
        </div>
      </div>`;
    showDialog(querySelector("#city-modal"));
  }
  function openInformationDetails(informationId) {
    const details = informationDetails[informationId];
    if (!details) return;
    const translationKey = `information.${informationId}`;
    const title = window.i18n.t(`${translationKey}.title`);
    const checklist = Array.from({ length: 4 }, (_, index) =>
      window.i18n.t(`${translationKey}.item.${index + 1}`)
    );

    querySelector("#detail-modal").dataset.tone = details.tone;
    querySelector("#detail-modal").dataset.layout = details.layout || "cover";
    querySelector("#detail-content").innerHTML = `
      <div class="detail-cover">
        <img src="images/${details.image}.webp" width="900" height="600" alt="">
        <img class="popup-art" src="images/${details.art}.webp" width="180" height="180" alt="">
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${window.i18n.t("information.detailsEyebrow")}</p>
        <h2 id="detail-title">${title}</h2>
        <p>${window.i18n.t(`${translationKey}.text`)}</p>
        <ul class="checklist">${checklist.map((item) => `<li>${item}</li>`).join("")}</ul>
        <button class="button" data-contact="${details.purpose}" data-context="${title}">${window.i18n.t(`${translationKey}.cta`)} </button>
      </div>`;
    showDialog(querySelector("#detail-modal"));
  }
  function openDishDetails(dishName) {
    const dish = menuItems.find((item) => item.asset === dishName);
    if (!dish) return;
    const decoration = dishDecorations[menuItems.indexOf(dish) % dishDecorations.length];
    const name = window.i18n.t(`dish.menu.${dish.asset}.name`);
    const description = window.i18n.t(`dish.menu.${dish.asset}.description`);
    const preparation = window.i18n.t(`dish.menu.${dish.asset}.preparation`);
    const wishes = window.i18n.t(`dish.menu.${dish.asset}.wishes`);
    querySelector("#detail-modal").dataset.tone = "food";
    querySelector("#detail-modal").dataset.layout = "food";
    querySelector("#detail-content").innerHTML =
      `<div class="detail-food"><img src="${getDishImage(dish.asset)}" width="640" height="480" alt="${escapeHtml(name)}"><img class="food-back" src="${getDishImage(dish.asset, "ingredients")}" alt="" width="320" height="240"><img class="popup-art" src="images/v6b-${decoration}.webp" width="140" height="140" alt=""></div><div class="detail-copy"><p class="eyebrow">${window.i18n.t(dish.cat === "base" ? "dish.menu.mainLabel" : "dish.menu.optionalLabel")}</p><h2 id="detail-title">${escapeHtml(name)}</h2><p class="dish-description">${escapeHtml(description)}</p><div class="dish-detail-section"><h3>${window.i18n.t("dish.preparationHeading")}</h3><p>${escapeHtml(preparation)}</p></div><div class="dish-detail-section"><h3>${window.i18n.t("dish.arrangementsHeading")}</h3><p>${escapeHtml(wishes)}</p></div><p>${window.i18n.t(dish.cat === "base" ? "dish.mainMenuNote" : "dish.optionalMenuNote")}</p><p><strong>${window.i18n.t("dish.dietaryQuestion")}</strong> ${window.i18n.t("dish.dietaryInstructions")}</p><button class="button" data-contact="menu" data-context="${escapeHtml(window.i18n.t("dish.contactContext", { dish: name }))}">${window.i18n.t("dish.contactAction")} </button></div>`;
    showDialog(querySelector("#detail-modal"));
  }
  document.addEventListener("click", (event) => {
    const dishButton = event.target.closest("[data-dish]");
    if (dishButton) openDishDetails(dishButton.closest("[data-food-card]").dataset.foodCard);
    const mapButton = event.target.closest("[data-map]");
    if (mapButton) initializeCityMap().then(() => renderCityMap(mapButton.dataset.map));
    const cityButton = event.target.closest("[data-city]");
    if (cityButton) openCityDetails(cityButton.dataset.city);
    const informationButton = event.target.closest("[data-info]");
    if (informationButton) openInformationDetails(informationButton.dataset.info);
    const cityScrollButton = event.target.closest("[data-scroll-cities]");
    if (cityScrollButton)
      querySelector("#city-scroller").scrollBy({
        left:
          Number(cityScrollButton.dataset.scrollCities) *
          querySelector("#city-scroller").clientWidth *
          0.8,
        behavior: reducedMotionPreference.matches ? "instant" : "smooth",
      });
    const voteCityButton = event.target.closest("[data-vote-city]");
    if (voteCityButton) {
      querySelector("#city-modal").close();
      const citySelect = querySelector("#vote-form").elements.city;
      const cityId = voteCityButton.dataset.voteCity;
      const cityName = mapCities.find((city) => city.id === cityId)?.name || cityId;
      if ([...citySelect.options].some((option) => option.value === cityId))
        citySelect.value = cityId;
      else {
        citySelect.value = "other";
        querySelector("#contact-form").elements.context.value = cityName;
        openContactForm("question", window.i18n.t("city.voteContext", { city: cityName }));
        return;
      }
      querySelector("#future").scrollIntoView({
        behavior: reducedMotionPreference.matches ? "instant" : "smooth",
      });
      citySelect.focus({ preventScroll: true });
    }
  });
  querySelectorAll("[data-icon]").forEach((icon) => {
    icon.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true"><use href="assets/ui-icons-v6.svg#${icon.dataset.icon}"></use></svg>`;
  });
  function loadCityPreview(event) {
    const cityCard = event.target.closest(".map-pin,.city-card");
    if (!cityCard) return;
    const previewImage = cityCard.querySelector("[data-city-preview]");
    if (!previewImage || previewImage.hasAttribute("src")) return;
    previewImage.src = getCityPreview(previewImage.dataset.cityPreview);
  }
  document.addEventListener("pointerover", loadCityPreview);
  document.addEventListener("focusin", loadCityPreview);
  const featuredCityGroups = [
    [
      "fuengirola",
      "madrid",
      "asturias",
      "granada",
      "lisbon",
      "san-pedro",
      "marbella",
      "valencia",
      "alicante",
      "porto",
    ],
    ["san-pedro", "marbella", "valencia", "alicante", "porto"],
  ];
  const featuredCityCards = querySelectorAll(".location-list article");
  const featuredCityIndexes = [0, 0];
  let areFeaturedCitiesPaused = false;
  function renderDirectionCard(cardIndex) {
    const card = featuredCityCards[cardIndex];
    const cityId = featuredCityGroups[cardIndex][featuredCityIndexes[cardIndex]];
    const city = mapCities.find((mapCity) => mapCity.id === cityId);
    if (!card || !city) return;
    const venue = getCityVenue(cityId);
    card.innerHTML = `<img class="direction-art" src="${getCityImage(cityId)}" width="160" height="140" alt=""><span class="pill">${window.i18n.t("city.direction.pill")}</span><h3>${escapeHtml(city.name)}</h3><p>${venue ? `${escapeHtml(venue.name)}. ` : ""}${window.i18n.t("city.direction.description")}</p><button class="text-button" data-city="${cityId}">${window.i18n.t("city.direction.discussAction")} </button>${venue ? `<a class="text-link" href="${venue.mapUrl}" target="_blank" rel="noopener">${window.i18n.t("city.dialog.mapAction")} </a>` : ""}`;
    card.classList.remove("is-changing");
    card.offsetWidth;
    card.classList.add("is-changing");
  }
  if (featuredCityCards.length === 2) {
    const directionControls = document.createElement("div");
    directionControls.className = "direction-controls";
    directionControls.innerHTML = `<button class="text-button" id="directions-pause" aria-pressed="false">${window.i18n.t("city.direction.pauseAction")}</button><button class="text-button" id="directions-next">${window.i18n.t("city.direction.nextAction")} →</button>`;
    querySelector(".location-list").append(directionControls);
    const showNextFeaturedCity = (cardIndex) => {
      featuredCityIndexes[cardIndex] =
        (featuredCityIndexes[cardIndex] + 1) % featuredCityGroups[cardIndex].length;
      renderDirectionCard(cardIndex);
    };
    featuredCityCards.forEach((card, cardIndex) => {
      renderDirectionCard(cardIndex);
      setInterval(
        () => {
          const canAdvance =
            !areFeaturedCitiesPaused &&
            !reducedMotionPreference.matches &&
            !document.hidden &&
            !card.matches(":hover,:focus-within") &&
            !querySelector("dialog[open]");
          if (canAdvance) showNextFeaturedCity(cardIndex);
        },
        cardIndex === 0 ? 3000 : 4000
      );
    });
    querySelector("#directions-pause").addEventListener("click", (event) => {
      areFeaturedCitiesPaused = !areFeaturedCitiesPaused;
      event.currentTarget.setAttribute("aria-pressed", String(areFeaturedCitiesPaused));
      event.currentTarget.textContent = areFeaturedCitiesPaused
        ? window.i18n.t("city.direction.resumeAction")
        : window.i18n.t("city.direction.pauseAction");
    });
    querySelector("#directions-next").addEventListener("click", () => {
      showNextFeaturedCity(0);
      showNextFeaturedCity(1);
    });
  }
  querySelectorAll(".faq-list details").forEach((item) => {
    item.querySelector("summary").addEventListener("click", () => {
      if (item.open) return;

      querySelectorAll(".faq-list details[open]").forEach((openItem) => {
        if (openItem !== item) openItem.open = false;
      });
    });
  });
  const sectionNavigationLinks = querySelectorAll('#navigation a[href^="#"]');
  const navigationSections = sectionNavigationLinks
    .map((link) => ({ link, section: querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);
  let navigationUpdateFrame = 0;
  function updateActiveNavigationLink() {
    navigationUpdateFrame = 0;
    const navigationThreshold = (document.querySelector("header")?.offsetHeight || 80) + 100;
    let activeSection = navigationSections[0];
    const sortedSections = [...navigationSections].sort(
      (first, second) =>
        first.section.getBoundingClientRect().top - second.section.getBoundingClientRect().top
    );
    for (const section of sortedSections) {
      if (section.section.getBoundingClientRect().top <= navigationThreshold) {
        activeSection = section;
      }
    }
    for (const item of navigationSections) {
      const isActive = item === activeSection;
      item.link.classList.toggle("is-current", isActive);
      if (isActive) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  }
  window.addEventListener(
    "scroll",
    () => {
      if (navigationUpdateFrame) return;
      navigationUpdateFrame = requestAnimationFrame(updateActiveNavigationLink);
    },
    { passive: true }
  );
  window.addEventListener("resize", updateActiveNavigationLink);
  updateActiveNavigationLink();
  window.picnicCountdown.init(querySelector(".event-countdown"));
})();
