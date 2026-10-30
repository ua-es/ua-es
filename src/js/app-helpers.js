(() => {
  const coreDishAssets = new Set(["borscht", "chicken", "pork"]);
  const spanishCityImages = new Set([
    "bilbao",
    "santander",
    "santiago",
    "coruna",
    "vigo",
    "leon",
    "zaragoza",
    "pamplona",
    "jaen",
    "almeria",
    "dos-hermanas",
    "rinconada",
    "nerja",
    "estepona",
    "tarifa",
  ]);
  const portugalCities = new Set(["lisbon", "porto", "faro", "coimbra"]);
  const cityVenues = {
    fuengirola: {
      key: "city.venue.fuengirola",
      mapUrl: "https://maps.app.goo.gl/rhDWpfc5ChKzz9e16",
    },
    "san-pedro": {
      key: "city.venue.san-pedro",
      mapUrl: "https://maps.app.goo.gl/KMCY3a6NMj4NNJY38",
    },
  };

  function getCityImage(cityId) {
    if (portugalCities.has(cityId)) return `assets/v7-${cityId}.webp`;
    if (spanishCityImages.has(cityId)) return `assets/city-marks/${cityId}.svg`;
    return `assets/v6c-city-${cityId}.webp`;
  }

  function getCityPreview(cityId) {
    const imagePath = getCityImage(cityId);
    return imagePath.includes("isolated") ? imagePath : imagePath.replace(".webp", "-thumb.webp");
  }

  function isPhoneNumber(value) {
    const normalizedValue = value.trim();
    return (
      /^[+0-9() .-]{7,25}$/.test(normalizedValue) &&
      (normalizedValue.match(/\d/g) || []).length >= 7
    );
  }

  function getCityVenue(cityId) {
    const venue = cityVenues[cityId];

    return venue ? { name: window.i18n.t(venue.key), mapUrl: venue.mapUrl } : undefined;
  }

  function renderMapPin(city, overviewCityIds, coastalCityIds) {
    const pinClasses = [
      "map-pin",
      city.isPast ? "past" : "planned",
      overviewCityIds.includes(city.id) ? "overview-pin" : "detail-pin",
      coastalCityIds.includes(city.id) ? "coastal" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const left = (city.mapX / 1120) * 100;
    const top = (city.mapY / 900) * 100;

    return `<button class="${pinClasses}" data-city="${city.id}" style="left:${left}%;top:${top}%" aria-label="${city.name}"><img class="map-city-preview" src="${getCityPreview(city.id)}" alt="" width="180" height="120" loading="lazy"><i></i><span>${city.name}</span></button>`;
  }

  function renderCityCard(city) {
    const statusLabel = window.i18n.t(
      city.isPast ? "city.map.cityPast" : "city.map.cityPlanned"
    );

    return `<button class="city-card ${city.isPast ? "past" : "planned"}" data-city="${city.id}"><img class="map-city-preview" data-city-preview="${city.id}" src="${getCityPreview(city.id)}" loading="lazy" alt="" width="180" height="120"><i class="city-status-dot" role="img" aria-label="${statusLabel}"></i><strong>${city.name}</strong></button>`;
  }

  window.picnicAppHelpers = {
    querySelector(selector, root = document) {
      return root.querySelector(selector);
    },
    querySelectorAll(selector, root = document) {
      return [...root.querySelectorAll(selector)];
    },
    escapeHtml(value) {
      return String(value).replace(
        /[&<>"']/g,
        (character) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]
      );
    },
    getDishImage(assetId, imageType = "plate") {
      return `assets/${coreDishAssets.has(assetId) ? "v6" : "v6b"}-${imageType}-${assetId}.webp`;
    },
    getCityImage,
    getCityPreview,
    getCityVenue,
    renderMapPin,
    renderCityCard,
    isPhoneNumber,
    isValidContactMethod(contactMethod, contactValue) {
      const normalizedContact = contactValue.trim();
      if (contactMethod === "telegram") return /^@?[A-Za-z0-9_]{5,32}$/.test(normalizedContact);
      if (contactMethod === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedContact);
      return contactMethod === "phone" && isPhoneNumber(normalizedContact);
    },
  };
})();
