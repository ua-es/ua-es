import { expect, test } from "@playwright/test";

const cityMapIds = [
  "sevilla",
  "malaga",
  "torremolinos",
  "benalmadena",
  "marbella",
  "jerez",
  "valencia",
  "granada",
  "cordoba",
  "madrid",
  "alicante",
  "asturias",
  "fuengirola",
  "san-pedro",
  "cadiz",
  "huelva",
  "barcelona",
  "portugal",
  "chiclana",
  "lisbon",
  "porto",
  "faro",
  "coimbra",
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
  "ronda",
  "dos-hermanas",
  "rinconada",
  "nerja",
  "estepona",
  "tarifa",
];

const languages = [
  {
    code: "uk",
    path: "/",
    title: /Тепла зустріч/,
    galleryError: "Фото не завантажилося. Спробуйте ще раз або перейдіть до наступного.",
    imageError: "Не вдалося завантажити зображення",
    heroPlay: "Увімкнути автоматичну зміну слайдів",
    voteStatus: "Оберіть місто й зручний формат — надішліть побажання організатору.",
    contactTitle: "До зустрічі за спільним столом.",
    joinPlaceholder: "Особливості харчування, вік дітей, транспорт або ваше питання",
    feedbackLabel: "Що саме пропонуєте або хочете повідомити *",
    invalidName: "Укажіть ваше ім’я, щонайменше дві літери.",
    requestGreeting: "Вітаю! Участь у зустрічі.",
    requestName: "Ім’я: Olena.",
    replyConsent: "Згода на відповідь щодо цього звернення: так.",
    copyFailure: "Браузер не дозволив копіювання. Виділіть і скопіюйте текст нижче.",
    voteContext: "Побажання щодо майбутньої зустрічі:",
    informationDetailsEyebrow: "Деталі, які роблять зустріч простішою",
    dishMenuLabel: /Орієнтир основного меню|Додаткове меню/,
    dishes: [
      ["chicken", "Курячий шашлик"],
      ["pork", "Шашлик зі свинини"],
      ["borscht", "Український борщ"],
      ["okroshka", "Окрошка"],
      ["salad", "Овочеві салати"],
      ["olives", "Оливки"],
      ["varenyky", "Вареники"],
      ["canapes", "Іспанські канапе"],
      ["potatoes", "Картопля по-українськи"],
      ["pelmeni", "Пельмені"],
      ["sweet-crepes", "Солодкі млинці"],
      ["savory-crepes", "Солоні млинці"],
    ],
    firstDishDetails: [
      "Курячий шашлик готуємо для спільного столу: порційні шматочки м’яса, аромат мангала й подача одразу після приготування.",
      "Курятину закуповуємо під підтверджену кількість учасників, маринуємо та пакуємо заздалегідь. На місці смажимо партіями, щоб подавати гарячою.",
      "Напишіть, якщо потрібна менш гостра порція або важливо уточнити склад маринаду. Варіант без певних спецій погоджуємо до підготовки.",
    ],
    dishPreparationHeading: "Як готуємо",
    dishArrangementsHeading: "Що можна узгодити",
    dishDietaryQuestion: "Маєте алергію або особливості харчування?",
    dishDietaryInstructions: "Напишіть завчасно: уточнимо склад і можливі варіанти.",
    dishContactAction: "Уточнити склад або побажання",
    cityPastLabel: "Тут уже зустрічалися",
    cityMemoryHeading: "За спільним столом",
    cityMemoryArchiveLabel: "Відкрити спільний фотоархів",
    cityInvitation:
      "Запрошуйте друзів — українців, іспанців та всіх, хто хоче познайомитися й провести день разом.",
    citySupportAction: "Підтримати напрямок",
    cityJoinAction: "Хочу долучитися",
    citySevillaDescription:
      "Попередній анонс стосувався 17 жовтня 2026. Наступну дату ще не погоджено. Для нової зустрічі оберемо місце разом; до La Rinconada можна дістатися електричкою.",
    cityNewLabel: "Новий напрямок",
    cityDefaultNew:
      "Збираємо охочих. Коли буде достатньо людей, погодимо дату, місце, меню й спільні витрати.",
    cityProposedVenue: "Природний парк Фуенхіроли — запропоноване місце, дата ще не визначена.",
    cityMapAction: "Переглянути місце на карті",
    cityContactContext: "Зустріч: Фуенхірола",
    mapTitleSpain: "Іспанія та нові напрямки",
    mapTitleAndalucia: "Андалусія — ближче до своїх",
    mapTitlePortugal: "Португалія — нові напрямки",
    cityPastStatus: "Уже зустрічалися",
    cityPlannedStatus: "Майбутній напрямок",
    addCityStatus: "Новий напрямок",
    addCityTitle: "Ваше місто +",
    addCityAction: "Запропонувати зустріч",
    addCityContext: "Хочу зустріч у новому місті",
    venueGalleryDialog: "Фотографії парку та пікніка",
    venueGalleryClose: "Закрити",
    venueGalleryPrevious: "Попереднє фото",
    venueGalleryNext: "Наступне фото",
    directionPill: "Коли збереться компанія",
    directionDescription: "Збираємо охочих. Дату, місце та бюджет погодимо разом заздалегідь.",
    directionDiscuss: "Обговорити напрямок",
    directionPause: "Зупинити зміну",
    directionResume: "Продовжити зміну",
    directionNext: "Інші напрямки",
    cityVoteContext: "Майбутня зустріч: Лісабон",
    informationDialogs: {
      first: ["Приходьте, навіть якщо ви вперше.", "Хочу познайомитися"],
      drinks: ["Улюблені напої — із собою.", "Уточнити, що взяти"],
      help: ["Зробимо цей день разом.", "Можу допомогти"],
      support: ["Підтримка, що стає спільним днем.", "Запропонувати підтримку"],
    },
  },
  {
    code: "en",
    path: "/en/index.html",
    title: /Ukrainian community gatherings/,
    galleryError: "The photo could not load. Try again or move to the next one.",
    imageError: "The image could not be loaded",
    heroPlay: "Enable automatic slides",
    voteStatus:
      "Choose your city and preferred format, then send your preferences to the organiser.",
    contactTitle: "See you around the table.",
    joinPlaceholder: "Dietary needs, children’s ages, transport or your question",
    feedbackLabel: "What would you like to suggest or tell us? *",
    invalidName: "Enter your real name, at least two letters.",
    requestGreeting: "Hello! Joining a gathering.",
    requestName: "Name: Olena.",
    replyConsent: "Consent to a reply about this enquiry: yes.",
    copyFailure: "Your browser blocked copying. Select and copy the text below.",
    voteContext: "Preferences for a future gathering:",
    informationDetailsEyebrow: "Details that make getting together easier",
    dishMenuLabel: /Sample main menu|Optional menu/,
    dishes: [
      ["chicken", "Chicken shashlik"],
      ["pork", "Pork shashlik"],
      ["borscht", "Ukrainian borscht"],
      ["okroshka", "Okroshka"],
      ["salad", "Vegetable salads"],
      ["olives", "Olives"],
      ["varenyky", "Varenyky"],
      ["canapes", "Spanish canapés"],
      ["potatoes", "Ukrainian-style potatoes"],
      ["pelmeni", "Pelmeni"],
      ["sweet-crepes", "Sweet crêpes"],
      ["savory-crepes", "Savoury crêpes"],
    ],
    firstDishDetails: [
      "Grilled chicken for our shared table: bite-sized pieces, smoky barbecue flavour, served freshly cooked.",
      "We buy chicken for confirmed guests, marinate and pack it ahead, then grill in batches on site to serve it hot.",
      "Tell us ahead if you prefer mild seasoning or need marinade details. Any spice substitutions must be agreed before preparation.",
    ],
    dishPreparationHeading: "How we prepare it",
    dishArrangementsHeading: "What we can arrange",
    dishDietaryQuestion: "Any allergies or dietary requirements?",
    dishDietaryInstructions: "Write ahead: we will clarify ingredients and options.",
    dishContactAction: "Ask about ingredients or preferences",
    cityPastLabel: "We have met here",
    cityMemoryHeading: "Around the shared table",
    cityMemoryArchiveLabel: "Open the shared photo archive",
    cityInvitation:
      "Invite friends: Ukrainians, Spaniards and anyone who wants to meet and spend the day together.",
    citySupportAction: "Support this destination",
    cityJoinAction: "I would like to join",
    citySevillaDescription:
      "The previous announcement was for 17 October 2026. The next date is not agreed yet. We will choose a new venue together; La Rinconada is accessible by train.",
    cityNewLabel: "New destination",
    cityDefaultNew:
      "We are collecting interest. Once enough people join, we will agree the date, venue, menu and shared costs.",
    cityProposedVenue: "Fuengirola Natural Park — proposed venue; no date has been set.",
    cityMapAction: "View the venue on the map",
    cityContactContext: "Gathering: Fuengirola",
    mapTitleSpain: "Spain and new destinations",
    mapTitleAndalucia: "Andalusia — closer to our community",
    mapTitlePortugal: "Portugal — new destinations",
    cityPastStatus: "We have met here before",
    cityPlannedStatus: "Future destination",
    addCityStatus: "New destination",
    addCityTitle: "Your city +",
    addCityAction: "Suggest a gathering",
    addCityContext: "I’d like a gathering in a new city",
    venueGalleryDialog: "Park and picnic photos",
    venueGalleryClose: "Close",
    venueGalleryPrevious: "Previous photo",
    venueGalleryNext: "Next photo",
    directionPill: "When a group comes together",
    directionDescription:
      "We are gathering interest. We will agree the date, venue and budget together in advance.",
    directionDiscuss: "Discuss this destination",
    directionPause: "Pause rotation",
    directionResume: "Resume rotation",
    directionNext: "Other destinations",
    cityVoteContext: "Future gathering: Lisbon",
    informationDialogs: {
      first: ["Come along, even for the first time.", "I would like to meet everyone"],
      drinks: ["Bring your favourite drinks.", "Ask what to bring"],
      help: ["Let’s make this day happen together.", "I can help"],
      support: ["Support that brings us together.", "Offer support"],
    },
  },
  {
    code: "es",
    path: "/es/index.html",
    title: /encuentros de ucranianos/,
    galleryError: "No se ha podido cargar la foto. Inténtalo de nuevo o pasa a la siguiente.",
    imageError: "No se ha podido cargar la imagen",
    heroPlay: "Activar el cambio automático de diapositivas",
    voteStatus:
      "Elige tu ciudad y el formato que prefieres y envía tu propuesta a la organización.",
    contactTitle: "Nos vemos alrededor de la mesa.",
    joinPlaceholder: "Necesidades alimentarias, edad de los niños, transporte o tu consulta",
    feedbackLabel: "¿Qué quieres proponer o contarnos? *",
    invalidName: "Indica tu nombre real, con al menos dos letras.",
    requestGreeting: "¡Hola! Participar en un encuentro.",
    requestName: "Nombre: Olena.",
    replyConsent: "Consentimiento para responder a esta consulta: sí.",
    copyFailure: "Tu navegador ha bloqueado la copia. Selecciona y copia el texto de abajo.",
    voteContext: "Preferencias para un futuro encuentro:",
    informationDetailsEyebrow: "Detalles que facilitan el encuentro",
    dishMenuLabel: /Menú principal orientativo|Menú adicional/,
    dishes: [
      ["chicken", "Brochetas de pollo"],
      ["pork", "Brochetas de cerdo"],
      ["borscht", "Borsch ucraniano"],
      ["okroshka", "Okróshka"],
      ["salad", "Ensaladas de verduras"],
      ["olives", "Aceitunas"],
      ["varenyky", "Varényky"],
      ["canapes", "Canapés españoles"],
      ["potatoes", "Patatas al estilo ucraniano"],
      ["pelmeni", "Pelmeni"],
      ["sweet-crepes", "Crepes dulces"],
      ["savory-crepes", "Crepes salados"],
    ],
    firstDishDetails: [
      "Pollo a la brasa para compartir: trozos de carne, aroma de barbacoa y servicio recién hecho.",
      "Compramos el pollo según las personas confirmadas, lo marinamos y envasamos antes y lo asamos por tandas para servirlo caliente.",
      "Avísanos si prefieres menos especias o necesitas conocer el marinado. Los cambios se acuerdan antes de preparar.",
    ],
    dishPreparationHeading: "Cómo lo preparamos",
    dishArrangementsHeading: "Qué podemos acordar",
    dishDietaryQuestion: "¿Tienes alergias o necesidades alimentarias?",
    dishDietaryInstructions: "Escribe con antelación: aclararemos los ingredientes y las opciones.",
    dishContactAction: "Consultar ingredientes o preferencias",
    cityPastLabel: "Ya nos hemos reunido aquí",
    cityMemoryHeading: "Alrededor de la mesa",
    cityMemoryArchiveLabel: "Abrir el archivo de fotos compartido",
    cityInvitation:
      "Invita a tus amigos: ucranianos, españoles y cualquiera que quiera conocernos y pasar el día juntos.",
    citySupportAction: "Me interesa este destino",
    cityJoinAction: "Quiero participar",
    citySevillaDescription:
      "El anuncio anterior era para el 17 de octubre de 2026. Aún no hay próxima fecha. Elegiremos juntos el lugar; se puede llegar a La Rinconada en tren.",
    cityNewLabel: "Nuevo destino",
    cityDefaultNew:
      "Reunimos a los interesados. Cuando haya suficientes personas, acordaremos fecha, lugar, menú y gastos compartidos.",
    cityProposedVenue: "Parque Natural de Fuengirola — lugar propuesto; fecha aún por definir.",
    cityMapAction: "Ver el lugar en el mapa",
    cityContactContext: "Encuentro: Fuengirola",
    mapTitleSpain: "España y nuevos destinos",
    mapTitleAndalucia: "Andalucía: más cerca de nuestra comunidad",
    mapTitlePortugal: "Portugal: nuevos destinos",
    cityPastStatus: "Ya nos hemos reunido aquí",
    cityPlannedStatus: "Futuro destino",
    addCityStatus: "Nuevo destino",
    addCityTitle: "Tu ciudad +",
    addCityAction: "Proponer un encuentro",
    addCityContext: "Quiero un encuentro en una nueva ciudad",
    venueGalleryDialog: "Fotos del parque y del pícnic",
    venueGalleryClose: "Cerrar",
    venueGalleryPrevious: "Foto anterior",
    venueGalleryNext: "Foto siguiente",
    directionPill: "Cuándo se reúna un grupo",
    directionDescription:
      "Reunimos a los interesados. Acordaremos juntos la fecha, el lugar y el presupuesto con antelación.",
    directionDiscuss: "Comentar este destino",
    directionPause: "Pausar el cambio",
    directionResume: "Reanudar el cambio",
    directionNext: "Otros destinos",
    cityVoteContext: "Futuro encuentro: Lisboa",
    informationDialogs: {
      first: ["Ven, aunque sea tu primera vez.", "Quiero conocer al grupo"],
      drinks: ["Trae tus bebidas favoritas.", "Consultar qué llevar"],
      help: ["Hagamos posible este día juntos.", "Puedo ayudar"],
      support: ["Apoyo que nos reúne.", "Ofrecer apoyo"],
    },
  },
];

const cityDescriptionIds = [
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
];

const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

for (const language of languages) {
  test(`${language.code}: page loads, countdown runs, and JavaScript is error-free`, async ({
    page,
  }) => {
    const assetFailures = [];
    page.on("response", (response) => {
      if (
        /\/(?:js|css)\/.*\.(?:js|css)$/.test(new URL(response.url()).pathname) &&
        !response.ok()
      ) {
        assetFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(language.path);

    await expect(page.locator("html")).toHaveAttribute("lang", language.code);
    await expect(page).toHaveTitle(language.title);
    await expect.poll(() => page.evaluate(() => typeof window.picnicCountdown)).toBe("object");
    await expect.poll(() => page.evaluate(() => typeof window.i18n?.t)).toBe("function");
    await expect
      .poll(() => page.evaluate(() => typeof window.picnicSiteControls?.showDialog))
      .toBe("function");
    await expect(page.locator(".countdown-units")).toBeVisible();
    await expect(page.locator(".countdown-ended")).toBeHidden();
    await expect(page.locator('[data-clock="days"]')).not.toHaveText("00");
    await expect(page.locator(".hero-slide").first()).toBeVisible();
    await expect(page.locator("#hero-pause")).toHaveAttribute("aria-label", language.heroPlay);
    await expect(page.locator("#vote-results")).toHaveText(language.voteStatus);
    expect(assetFailures).toEqual([]);
  });

  test(`${language.code}: carousel, dish details, and city map work`, async ({ page }) => {
    await page.goto(language.path);

    await expect(page.locator("#map-title")).toHaveText(language.mapTitleSpain);
    for (const cityId of cityMapIds) {
      const expectedName = await page.evaluate((id) => window.i18n.t(`city.name.${id}`), cityId);
      await expect(page.locator(`#city-scroller [data-city="${cityId}"] strong`)).toHaveText(
        expectedName
      );
    }
    for (const pin of await page.locator(".map-pin").all()) {
      const cityId = await pin.getAttribute("data-city");
      const expectedName = await page.evaluate((id) => window.i18n.t(`city.name.${id}`), cityId);
      await expect(pin.locator("span")).toHaveText(expectedName);
    }
    await expect(
      page.locator('#city-scroller [data-city="sevilla"] .city-status-dot')
    ).toHaveAttribute("aria-label", language.cityPastStatus);
    const addCityCard = page.locator("#city-scroller .add-city");
    await expect(addCityCard.locator(".city-status")).toHaveText(language.addCityStatus);
    await expect(addCityCard.locator("strong")).toHaveText(language.addCityTitle);
    await expect(addCityCard.locator("span").last()).toHaveText(language.addCityAction);
    await expect(addCityCard).toHaveAttribute("data-context", language.addCityContext);
    const directionCards = page.locator(".location-list article");
    for (const card of await directionCards.all()) {
      await expect(card.locator(".pill")).toHaveText(language.directionPill);
      await expect(card.locator("p")).toContainText(language.directionDescription);
      await expect(card.locator("[data-city]")).toHaveText(language.directionDiscuss);
      const cityId = await card.locator("[data-city]").getAttribute("data-city");
      await expect(card.locator("h3")).toHaveText(
        await page.evaluate((id) => window.i18n.t(`city.name.${id}`), cityId)
      );
    }
    const directionPauseButton = page.locator("#directions-pause");
    await expect(directionPauseButton).toHaveText(language.directionPause);
    await expect(page.locator("#directions-next")).toHaveText(`${language.directionNext} →`);
    await directionPauseButton.click();
    await expect(directionPauseButton).toHaveAttribute("aria-pressed", "true");
    await expect(directionPauseButton).toHaveText(language.directionResume);
    await directionPauseButton.click();
    await expect(directionPauseButton).toHaveAttribute("aria-pressed", "false");
    await expect(directionPauseButton).toHaveText(language.directionPause);

    await page.locator("#hero-next").click();
    await expect(page.locator(".hero-slide").nth(1)).toBeVisible();

    for (const [index, [dishId, dishName]] of language.dishes.entries()) {
      await page.locator(`[data-food-card="${dishId}"] [data-dish]`).first().click();
      const dishDialog = page.locator("#detail-modal");
      await expect(dishDialog).toBeVisible();
      await expect(dishDialog.locator("#detail-title")).toHaveText(dishName);
      await expect(dishDialog.locator(".dish-description")).not.toBeEmpty();
      await expect(dishDialog.locator(".dish-detail-section p")).toHaveCount(2);
      await expect(dishDialog.locator(".dish-detail-section p").first()).not.toBeEmpty();
      await expect(dishDialog.locator(".dish-detail-section p").last()).not.toBeEmpty();
      if (index === 0) {
        await expect(dishDialog.locator(".dish-description")).toHaveText(
          language.firstDishDetails[0]
        );
        await expect(dishDialog.locator(".dish-detail-section p").first()).toHaveText(
          language.firstDishDetails[1]
        );
        await expect(dishDialog.locator(".dish-detail-section p").last()).toHaveText(
          language.firstDishDetails[2]
        );
        await expect(dishDialog.locator(".eyebrow")).toHaveText(language.dishMenuLabel);
        await expect(dishDialog.locator("h3").nth(0)).toHaveText(language.dishPreparationHeading);
        await expect(dishDialog.locator("h3").nth(1)).toHaveText(language.dishArrangementsHeading);
        await expect(dishDialog.locator("strong")).toHaveText(language.dishDietaryQuestion);
        await expect(dishDialog.locator(".detail-copy > p").last()).toContainText(
          language.dishDietaryInstructions
        );
        await expect(dishDialog.locator("[data-contact]")).toHaveText(language.dishContactAction);
      }
      await dishDialog.locator("[data-close]").click();
    }

    for (const [dialogId, [title, action]] of Object.entries(language.informationDialogs)) {
      await page.locator(`[data-info="${dialogId}"]`).first().click();
      const informationDialog = page.locator("#detail-modal");
      await expect(informationDialog).toBeVisible();
      await expect(informationDialog.locator(".eyebrow")).toHaveText(
        language.informationDetailsEyebrow
      );
      await expect(informationDialog.locator("#detail-title")).toHaveText(title);
      await expect(informationDialog.locator(".checklist li")).toHaveCount(4);
      await expect(informationDialog.locator(".checklist li").first()).not.toBeEmpty();
      await expect(informationDialog.locator("[data-contact]")).toHaveText(action);
      await informationDialog.locator("[data-close]").click();
      await expect(informationDialog).toBeHidden();
    }

    await page.locator('#city-scroller [data-city="sevilla"]').click();
    const cityDialog = page.locator("#city-modal");
    await expect(cityDialog).toBeVisible();
    await expect(cityDialog.locator(".detail-copy > p").nth(1)).toHaveText(
      language.citySevillaDescription
    );
    await expect(cityDialog.locator(".eyebrow")).toHaveText(language.cityPastLabel);
    await expect(cityDialog.locator(".city-memory h3")).toHaveText(language.cityMemoryHeading);
    await expect(cityDialog.locator(".memory-gallery button").first()).toHaveAttribute(
      "aria-label",
      language.cityMemoryArchiveLabel
    );
    await expect(cityDialog.locator(".detail-copy > p").last()).toHaveText(language.cityInvitation);
    await expect(cityDialog.locator("[data-vote-city]")).toHaveText(language.citySupportAction);
    await expect(cityDialog.locator('[data-contact="question"]')).toHaveText(
      language.cityJoinAction
    );
    await cityDialog.locator("[data-close]").click();

    for (const cityId of cityDescriptionIds.filter((id) => id !== "portugal")) {
      await page.locator(`#city-scroller [data-city="${cityId}"]`).click();
      await expect(cityDialog.locator(".detail-copy > p").nth(1)).not.toBeEmpty();
      await cityDialog.locator("[data-close]").click();
    }

    await page.locator('button[data-map="portugal"]').click();
    await page.locator('#city-scroller [data-city="portugal"]').click();
    await expect(cityDialog.locator(".detail-copy > p").nth(1)).not.toBeEmpty();
    await cityDialog.locator("[data-close]").click();

    await page.locator('button[data-map="portugal"]').click();
    await expect(page.locator('button[data-map="portugal"]')).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.locator("#map-title")).toHaveText(language.mapTitlePortugal);
    await page.locator('#city-scroller [data-city="lisbon"]').click();
    await expect(cityDialog).toBeVisible();
    await expect(cityDialog.locator("#city-title")).toHaveText(
      await page.evaluate(() => window.i18n.t("city.name.lisbon"))
    );
    await expect(cityDialog.locator(".eyebrow")).toHaveText(language.cityNewLabel);
    await expect(cityDialog.locator(".detail-copy > p").nth(1)).toHaveText(language.cityDefaultNew);
    await cityDialog.locator("[data-vote-city]").click();
    await expect(page.locator("#contact-modal")).toBeVisible();
    await expect(page.locator('#contact-form [name="purpose"]')).toHaveValue("question");
    await expect(page.locator('#contact-form [name="context"]')).toHaveValue(
      language.cityVoteContext
    );
    await page.locator("#contact-modal [data-close]").click();

    await page.locator('button[data-map="andalucia"]').click();
    await expect(page.locator("#map-title")).toHaveText(language.mapTitleAndalucia);
    await expect(
      page.locator('#city-scroller [data-city="fuengirola"] .city-status-dot')
    ).toHaveAttribute("aria-label", language.cityPlannedStatus);
    await page.locator('#city-scroller [data-city="fuengirola"]').click();
    await expect(cityDialog.locator(".detail-copy")).toContainText(language.cityProposedVenue);
    await expect(cityDialog.locator(".detail-copy a")).toHaveText(language.cityMapAction);
    await expect(cityDialog.locator('[data-contact="question"]')).toHaveAttribute(
      "data-context",
      language.cityContactContext
    );
    await cityDialog.locator("[data-close]").click();
  });

  test(`${language.code}: contact form adapts to purpose and validates its fields`, async ({
    page,
  }) => {
    await page.goto(language.path);
    await page.locator('[data-contact="join"]').first().click();

    const dialog = page.locator("#contact-modal");
    const form = page.locator("#contact-form");
    await expect(dialog).toBeVisible();
    await expect(page.locator("#contact-title")).toHaveText(language.contactTitle);
    await form.locator('[name="name"]').fill("A");
    await form.evaluate((contactForm) =>
      contactForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
    );
    await expect
      .poll(() => form.locator('[name="name"]').evaluate((input) => input.validationMessage))
      .toBe(language.invalidName);
    await form.locator('[name="name"]').fill("Alex");
    await form.locator('[name="context"]').fill("");
    await form.locator('[name="purpose"]').selectOption("join");
    await expect(form.locator('[name="message"]')).toHaveAttribute(
      "placeholder",
      language.joinPlaceholder
    );
    await expect(form.locator(".participant-fields")).toBeVisible();
    await expect(form.locator('[name="adults"]')).toBeEnabled();
    await expect(form.locator('[name="adults"]')).toHaveAttribute("required", "");

    await form.locator('[name="purpose"]').selectOption("feedback");
    await expect(form.locator(".participant-fields")).toBeHidden();
    await expect(form.locator(".review-consent")).toBeVisible();
    await expect(page.locator("#message-label")).toHaveText(language.feedbackLabel);

    await form.locator('[name="method"]').selectOption({ index: 1 });
    await expect(form.locator('[name="method"]')).toHaveValue("phone");
    await expect(form.locator('[name="contact"]')).toHaveAttribute("type", "tel");
    await form.locator('[name="method"]').selectOption("telegram");
    await expect(form.locator('[name="contact"]')).toHaveAttribute("type", "text");
    await dialog.locator("[data-close]").click();
    await expect(dialog).toBeHidden();
  });

  test(`${language.code}: translated gallery and image errors are displayed`, async ({ page }) => {
    await page.route("**/gallery-image-error-for-translation-test.webp*", (route) => route.abort());
    await page.goto(language.path);

    await page.locator('[data-photo="0"]').first().click();
    await expect
      .poll(() =>
        page.locator("#large-photo").evaluate((image) => image.complete && image.naturalWidth > 0)
      )
      .toBe(true);
    await page.locator("#large-photo").evaluate((image) => {
      image
        .closest("picture")
        .querySelectorAll("source")
        .forEach((source) => source.remove());
      image.src = "/gallery-image-error-for-translation-test.webp";
    });
    await expect(page.locator("#photo-status")).toHaveText(language.galleryError);
    await expect(page.locator("#photo-retry")).toBeVisible();

    await page.evaluate(() => {
      const image = document.createElement("img");
      image.src = "/missing-image-for-translation-test.webp";
      document.body.append(image);
    });
    await expect(page.locator(".image-load-error").last()).toHaveText(language.imageError);
  });
}

test("language switch keeps the current section", async ({ page }) => {
  await page.goto("/#event");
  await page.locator("#language-choice").selectOption("en");

  await expect(page).toHaveURL(/\/en\/index\.html#event$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("theme toggle updates and persists the selected theme", async ({ page }) => {
  await page.goto("/");

  const initialTheme = await page.locator("html").getAttribute("data-theme");
  await page.locator(".theme-toggle").click();

  const selectedTheme = initialTheme === "night" ? "day" : "night";
  await expect(page.locator("html")).toHaveAttribute("data-theme", selectedTheme);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("picnic-theme")))
    .toBe(selectedTheme);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selectedTheme);
});

test("hero carousel responds to controls and keyboard navigation", async ({ page }) => {
  await page.goto("/");

  await page.locator("#hero-next").click();
  await expect(page.locator(".hero-slide").nth(1)).toBeVisible();
  await page.locator(".hero-slider").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".hero-slide").first()).toBeVisible();
});

test("dish details can open the related contact form", async ({ page }) => {
  await page.goto("/");

  await page.locator("[data-dish]").first().click();
  await expect(page.locator("#detail-modal")).toBeVisible();
  await expect(page.locator("#detail-title")).toBeVisible();
  await page.locator("#detail-modal [data-contact]").click();

  await expect(page.locator("#detail-modal")).toBeHidden();
  await expect(page.locator("#contact-modal")).toBeVisible();
  await expect(page.locator("#contact-form [name='purpose']")).toHaveValue("menu");
});

test("map filters cities and opens a city detail dialog", async ({ page }) => {
  await page.goto("/");
  await page.locator('button[data-map="portugal"]').click();

  await expect(page.locator('button[data-map="portugal"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#map-title")).toContainText("Португалія");
  await page.locator("#city-scroller [data-city]").first().click();
  await expect(page.locator("#city-modal")).toBeVisible();
  await expect(page.locator("#city-title")).toBeVisible();
  await page.locator("#city-modal [data-close]").click();
  await expect(page.locator("#city-modal")).toBeHidden();
});

test("event information opens its provisional-date dialog", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-info="event"]').first().click();

  const dialog = page.locator("#planned-event-modal");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("28 листопада 2026");
  await dialog.locator("button").click();
  await expect(dialog).toBeHidden();
});

for (const language of languages) {
  test(`${language.code}: venue gallery opens a localized lightbox and navigates photos`, async ({
    page,
  }) => {
    await page.goto(language.path);
    await page.locator(".venue-photo").first().click();

    const lightbox = page.locator(".venue-lightbox");
    const photoCount = await page.locator(".venue-photo").count();
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveAttribute("aria-label", language.venueGalleryDialog);
    await expect(lightbox.locator(".venue-lightbox-close")).toHaveAttribute(
      "aria-label",
      language.venueGalleryClose
    );
    await expect(lightbox.locator('[data-step="-1"]')).toHaveAttribute(
      "aria-label",
      language.venueGalleryPrevious
    );
    await expect(lightbox.locator('[data-step="1"]')).toHaveAttribute(
      "aria-label",
      language.venueGalleryNext
    );
    await expect(lightbox.locator(".venue-lightbox-counter")).toHaveText(`1 / ${photoCount}`);
    await lightbox.locator('[data-step="1"]').click();
    await expect(lightbox.locator(".venue-lightbox-counter")).toHaveText(`2 / ${photoCount}`);
    await lightbox.locator(".venue-lightbox-close").click();
    await expect(lightbox).toBeHidden();
  });
}

for (const language of languages) {
  test(`${language.code}: photo gallery opens, navigates, and closes`, async ({ page }) => {
    await page.goto(language.path);
    await page.locator('[data-photo="0"]').first().click();

    const dialog = page.locator("#photo-modal");
    const image = dialog.locator("#large-photo");
    await expect(dialog).toBeVisible();
    await expect(image).toHaveAttribute("src", /archive-forest/);
    await expect(image).toHaveAttribute(
      "alt",
      await page.evaluate(() => window.i18n.t("gallery.photo.archive-forest.alt"))
    );
    await expect(page.locator("#photo-caption")).toContainText(
      await page.evaluate(() => window.i18n.t("gallery.photo.archive-forest.caption"))
    );
    const firstPhoto = await image.getAttribute("src");

    await dialog.locator("#photo-next").click();
    await expect(image).not.toHaveAttribute("src", firstPhoto);
    await expect(image).toHaveAttribute(
      "alt",
      await page.evaluate(() => window.i18n.t("gallery.photo.archive-beach.alt"))
    );
    await expect(page.locator("#photo-caption")).toContainText(
      await page.evaluate(() => window.i18n.t("gallery.photo.archive-beach.caption"))
    );
    await dialog.locator("[data-close]").click();
    await expect(dialog).toBeHidden();
  });
}

for (const language of languages) {
  test(`${language.code}: vote form requires selections and opens a translated contact request`, async ({
    page,
  }) => {
    await page.goto(language.path);

    const form = page.locator("#vote-form");
    for (const select of await form.locator("select").all()) {
      await expect(select).toHaveAttribute("required", "");
      await select.evaluate((element) => {
        element.value = "";
        element.dispatchEvent(new Event("change", { bubbles: true }));
      });
      await expect.poll(() => select.evaluate((element) => element.validity.valid)).toBe(false);
      await select.selectOption({ index: 1 });
      await expect.poll(() => select.evaluate((element) => element.validity.valid)).toBe(true);
    }
    await form.locator('[type="submit"]').click();

    await expect(page.locator("#contact-modal")).toBeVisible();
    await expect(page.locator('#contact-form [name="purpose"]')).toHaveValue("question");
    await expect(page.locator('#contact-form [name="context"]')).toHaveValue(
      new RegExp(`^${language.voteContext}`)
    );
  });
}

for (const language of languages) {
  test(`${language.code}: valid contact request opens localized Telegram message`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.open = (url) => {
        window.__openedRequestUrl = url;
        return null;
      };
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => Promise.reject(new Error("Clipboard unavailable")) },
      });
    });
    await page.goto(language.path);
    await page.locator('[data-contact="join"]').first().click();

    const form = page.locator("#contact-form");
    await expect(form.locator('[name="name"]')).toHaveAttribute("required", "");
    await expect(form.locator('[name="contact"]')).toHaveAttribute("required", "");
    await form.locator('[name="name"]').fill("Olena");
    await form.locator('[name="city"]').fill("Seville");
    await form.locator('[name="contact"]').fill("@olena_test");
    await form.locator('[name="consent"]').check();
    await form.locator('[type="submit"]').click();

    await expect(page.locator("#contact-result a")).toHaveAttribute("href", /^https:\/\/t\.me\//);
    await expect(page.locator("#copy-status")).toHaveText(language.copyFailure);
    await expect(page.locator(".message-preview")).toHaveValue(/Olena/);
    const telegramUrl = await page.evaluate(() => window.__openedRequestUrl);
    expect(telegramUrl).toContain("t.me/");
    const requestText = new URL(telegramUrl).searchParams.get("text");
    expect(requestText).toContain(language.requestGreeting);
    expect(requestText).toContain(language.requestName);
    expect(requestText).toContain(
      await page.evaluate(() => window.i18n.t("contact.method.telegram"))
    );
    expect(requestText).toContain(language.replyConsent);
  });
}

test("mobile navigation opens and follows a section link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.locator(".menu-button").click();
  const navigation = page.locator("#mobile-navigation");
  await expect(navigation).toBeVisible();
  await navigation.locator('a[href="#event"]').click();
  await expect(page).toHaveURL(/#event$/);
  await expect(navigation).toBeHidden();
});

test("FAQ keeps only the selected answer open", async ({ page }) => {
  await page.goto("/");

  const questions = page.locator(".faq-list details");
  await questions.nth(0).locator("summary").click();
  await expect(questions.nth(0)).toHaveAttribute("open", "");
  await questions.nth(1).locator("summary").click();
  await expect(questions.nth(1)).toHaveAttribute("open", "");
  await expect(questions.nth(0)).not.toHaveAttribute("open", "");
});
