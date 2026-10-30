(() => {
  const pageTextByLanguage = {
    uk: {
      date: "28 листопада 2026 · 11:00",
      month: "листопада",
      status: "Попередній план · дату та місце підтверджуємо",
      end: "Запланований час настав. Уточніть статус зустрічі в організатора.",
      love: "Зроблено з любов’ю для українців та друзів в Іспанії",
      privacy: "Конфіденційність",
      cookies: "Cookies та налаштування",
      terms: "Умови участі",
      close: "Закрити",
      nav: "Навігація",
      caption:
        "Спільні моменти, нові знайомства й час разом. У нашій компанії є місце і давнім друзям, і тим, хто приєднався вперше.",
      event:
        "Попередньо плануємо зустріч 28 листопада 2026 року о 11:00 за часом Іспанії. Місце, меню та внесок ще погоджуємо. Відлік показує час до попередньої дати й не є підтвердженням події.",
      notice:
        "Цей сайт використовує локальне збереження вибраної теми. У коді сторінки немає рекламних чи аналітичних трекерів.",
      ok: "Зрозуміло",
    },
    en: {
      date: "28 November 2026 · 11:00",
      month: "November",
      status: "Provisional plan · date and venue to be confirmed",
      end: "The planned time has arrived. Check the event status with the organiser.",
      love: "Made with love for Ukrainians and friends in Spain",
      privacy: "Privacy",
      cookies: "Cookies and preferences",
      terms: "Participation terms",
      close: "Close",
      nav: "Navigation",
      caption:
        "Shared moments, new connections and time together. There is room in our community for old friends and those joining for the first time.",
      event:
        "We provisionally plan to meet on 28 November 2026 at 11:00 Spanish time. The venue, menu and contribution are still to be agreed. The countdown shows the provisional date and does not confirm the event.",
      notice:
        "This site stores your chosen theme locally. The page code contains no advertising or analytics trackers.",
      ok: "Understood",
    },
    es: {
      date: "28 de noviembre de 2026 · 11:00",
      month: "noviembre",
      status: "Plan provisional · fecha y lugar por confirmar",
      end: "Ha llegado la hora prevista. Consulta el estado del encuentro con la organización.",
      love: "Hecho con cariño para ucranianos y amigos en España",
      privacy: "Privacidad",
      cookies: "Cookies y preferencias",
      terms: "Condiciones de participación",
      close: "Cerrar",
      nav: "Navegación",
      caption:
        "Momentos compartidos, nuevas amistades y tiempo juntos. En nuestra comunidad hay sitio para viejos amigos y para quienes se unen por primera vez.",
      event:
        "Proponemos reunirnos el 28 de noviembre de 2026 a las 11:00, hora de España. El lugar, el menú y la aportación siguen pendientes. La cuenta atrás corresponde a una fecha provisional y no confirma el evento.",
      notice:
        "Este sitio guarda localmente el tema que eliges. El código de la página no contiene rastreadores publicitarios ni analíticos.",
      ok: "Entendido",
    },
  };

  const legalTextByLanguage = {
    uk: {
      privacy: [
        "Сторінка готує текст звернення з іменем, містом, контактом, кількістю учасників та вашими побажаннями. Вона не надсилає форму у власну базу даних: повідомлення передається організатору лише після вашої дії в Telegram або поштовому застосунку. Не додавайте документи чи медичні діагнози; щодо харчування достатньо вказати продукти, яких слід уникати.",
        "Звернення потрібне для відповіді та узгодження участі. Згода на новини про наступні зустрічі та публікацію відгуку — окрема й необов’язкова. Ви можете відкликати згоду, попросити доступ, виправлення або видалення даних через організатора. Також можна звернутися до AEPD.",
        "Telegram, пошта та хостинг обробляють дані за власними правилами, зокрема технічні дані підключення. Перед переходом ознайомтеся з їхніми політиками. У коді цієї сторінки немає рекламного профілювання.",
      ],
      cookies: [
        "Сторінка зберігає вибір теми в localStorage під ключем picnic-theme. Це налаштування вигляду на вашому пристрої; ви можете видалити його в налаштуваннях браузера. Ознайомлення з цим повідомленням зберігається лише до закриття вкладки.",
        "У власному коді сторінки не встановлено аналітики чи рекламних трекерів. Вхід до приватного перегляду може використовувати технічні механізми хостингу. Зовнішні сайти відкриваються лише за посиланням та мають власні правила.",
        "Якщо буде додано необов’язкові трекери, їх не слід запускати до вибору користувача. Прийняття й відмова мають бути однаково доступними.",
      ],
      terms: [
        "Це інформаційна сторінка спільноти. Заявка або відлік не підтверджують участь. Дату, місце, меню, внесок, порядок оплати, зміни й повернення погоджуємо з організатором до переказу коштів.",
        "Напої кожен бере із собою. Діти залишаються під наглядом дорослих, які їх супроводжують. Дотримуйтеся правил локації, обмежень на вогонь та погоджених умов зустрічі.",
        "Поважайте інших учасників і не публікуйте їхні персональні дані чи портретні фото без належного дозволу. Повідомте організатору, якщо не бажаєте потрапляти у фото або просите видалити зображення.",
        "Ці умови не обмежують прав, які надає закон.",
      ],
    },
    en: {
      privacy: [
        "This page prepares an enquiry containing your name, city, contact details, party size and preferences. It does not submit the form to its own database: your message reaches the organiser only after your action in Telegram or your email app. Do not include documents or medical diagnoses; for food preferences, list ingredients to avoid.",
        "The enquiry is used to reply and arrange participation. Consent to future updates and publishing your feedback is separate and optional. You may withdraw consent and request access, correction or deletion through the organiser. You may also complain to the AEPD.",
        "Telegram, email and hosting providers process data under their own policies, including technical connection data. Read those policies before using their services. This page code contains no advertising profiling.",
      ],
      cookies: [
        "The page stores your theme choice in localStorage using the picnic-theme key. This is a display preference on your device and can be removed in browser settings. Dismissing this notice is remembered only until the tab closes.",
        "Our page code contains no advertising or analytics trackers. Signing into the private preview may use technical hosting mechanisms. External websites open only when you follow a link and have their own policies.",
        "If optional trackers are added later, they must not run before the user chooses. Accepting and refusing must be equally accessible.",
      ],
      terms: [
        "This is a community information page. An enquiry or countdown does not confirm participation. Agree the date, venue, menu, contribution, payment arrangements, changes and refunds with the organiser before transferring money.",
        "Bring your own drinks. Children remain under the supervision of accompanying adults. Follow the venue rules, fire restrictions and agreed event arrangements.",
        "Respect other participants and do not publish their personal data or identifiable portraits without appropriate permission. Tell the organiser if you do not wish to appear in photos or request removal of an image.",
        "These terms do not limit statutory rights.",
      ],
    },
    es: {
      privacy: [
        "Esta página prepara una consulta con tu nombre, ciudad, contacto, número de participantes y preferencias. No envía el formulario a una base de datos propia: el mensaje llega a la organización solo tras tu acción en Telegram o tu aplicación de correo. No incluyas documentos ni diagnósticos médicos; para la comida, basta con indicar los ingredientes que debes evitar.",
        "La consulta sirve para responder y acordar la participación. El consentimiento para recibir novedades y publicar tu opinión es independiente y opcional. Puedes retirarlo y solicitar acceso, rectificación o supresión a la organización. También puedes reclamar ante la AEPD.",
        "Telegram, el correo y el alojamiento tratan datos según sus propias políticas, incluidos datos técnicos de conexión. Consulta esas políticas antes de usar sus servicios. El código de esta página no elabora perfiles publicitarios.",
      ],
      cookies: [
        "La página guarda el tema elegido en localStorage con la clave picnic-theme. Es una preferencia visual en tu dispositivo y puedes borrarla desde los ajustes del navegador. El cierre de este aviso se recuerda solo hasta cerrar la pestaña.",
        "El código propio de la página no contiene rastreadores publicitarios ni analíticos. El acceso a la vista privada puede utilizar mecanismos técnicos del alojamiento. Los sitios externos se abren al seguir un enlace y tienen sus propias políticas.",
        "Si se añaden rastreadores opcionales, no deben activarse antes de que el usuario elija. Aceptar y rechazar deben ser igualmente accesibles.",
      ],
      terms: [
        "Esta es una página informativa de la comunidad. Una consulta o una cuenta atrás no confirma la participación. Acuerda con la organización la fecha, el lugar, el menú, la aportación, el pago, los cambios y las devoluciones antes de transferir dinero.",
        "Cada persona trae sus bebidas. Los niños permanecen bajo la supervisión de los adultos que los acompañan. Respeta las normas del lugar, las restricciones sobre fuego y las condiciones acordadas.",
        "Respeta a los demás participantes y no publiques sus datos ni retratos identificables sin el permiso adecuado. Avisa si no quieres aparecer en fotos o si solicitas retirar una imagen.",
        "Estas condiciones no limitan los derechos legales.",
      ],
    },
  };

  const language =
    document.documentElement.lang in pageTextByLanguage ? document.documentElement.lang : "uk";
  const pageText = pageTextByLanguage[language];

  function createDialog(dialogId, title) {
    const dialog = document.createElement("dialog");
    dialog.id = dialogId;
    dialog.setAttribute("aria-labelledby", `${dialogId}-title`);
    dialog.className = "legal-dialog";
    dialog.innerHTML = `<button class="mobile-nav-close" type="button" aria-label="${pageText.close}">×</button><h2 id="${dialogId}-title"></h2><div class="dialog-content"></div>`;
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
  const legalDialog = createDialog("legal-modal", pageText.privacy);
  const legalSectionTitlesByLanguage = {
    uk: {
      privacy: [
        "Які дані передаєте",
        "Для чого вони потрібні",
        "Зовнішні сервіси",
        "Відомості організатора",
      ],
      cookies: ["Ваші налаштування", "Зовнішні сервіси", "Ваш вибір"],
      terms: ["Підтвердження участі", "На зустрічі", "Фото та повага", "Ваші права"],
    },
    en: {
      privacy: [
        "Information you share",
        "How it is used",
        "External services",
        "Organiser details",
      ],
      cookies: ["Your preferences", "External services", "Your choice"],
      terms: ["Confirming participation", "At the gathering", "Photos and respect", "Your rights"],
    },
    es: {
      privacy: [
        "Datos que compartes",
        "Para qué se utilizan",
        "Servicios externos",
        "Datos de la organización",
      ],
      cookies: ["Tus preferencias", "Servicios externos", "Tu elección"],
      terms: ["Confirmar la participación", "En el encuentro", "Fotos y respeto", "Tus derechos"],
    },
  };

  function openLegalDialog(section) {
    legalDialog.querySelector("h2").textContent = pageText[section];
    const content = legalDialog.querySelector(".dialog-content");
    content.replaceChildren();

    for (const [index, paragraph] of legalTextByLanguage[language][section].entries()) {
      const heading = document.createElement("h3");
      heading.textContent = legalSectionTitlesByLanguage[language][section][index] || "";
      content.append(heading);

      const paragraphElement = document.createElement("p");
      paragraphElement.textContent = paragraph;
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
  cookieNotice.setAttribute("aria-label", pageText.cookies);
  const noticeText = document.createElement("p");
  noticeText.textContent = pageText.notice;
  cookieNotice.append(noticeText);
  for (const [label, onClick] of [
    [pageText.cookies, () => openLegalDialog("cookies")],
    [
      pageText.ok,
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

  const mobileNavigation = createDialog("mobile-navigation", pageText.nav);
  const navigationCopy = document.querySelector("#navigation").cloneNode(true);
  navigationCopy.removeAttribute("id");
  mobileNavigation.querySelector(".dialog-content").append(navigationCopy);
  navigationCopy.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileNavigation.close());
  });

  const menuButton = document.querySelector(".menu-button");
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

  const eventDialog = createDialog("planned-event-modal", pageText.date);
  eventDialog.querySelector(".dialog-content").textContent = pageText.event;
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

  const photoCaption = document.querySelector("#photo-caption");
  if (photoCaption) {
    const photoStory = document.createElement("p");
    photoStory.className = "photo-story";
    const photoStoriesByLanguage = {
      uk: [
        "Тут легко почати розмову: спільний день, знайомі смаки й люди, з якими хочеться зустрітися знову.",
        "Маленькі моменти великої компанії. Такі зустрічі — нагода відкласти щоденні справи й побути разом.",
        "Не обов’язково знати всіх заздалегідь. Знайомства часто починаються з простого привітання за спільним столом.",
      ],
      en: [
        "It is easy to start a conversation here: a shared day, familiar flavours and people you would like to see again.",
        "Little moments with a big group. Gatherings are a chance to set everyday tasks aside and spend time together.",
        "You do not need to know everyone beforehand. New connections often begin with a simple hello around the table.",
      ],
      es: [
        "Aquí es fácil empezar una conversación: un día compartido, sabores familiares y personas a las que apetece volver a ver.",
        "Pequeños momentos en buena compañía. Los encuentros permiten dejar a un lado las tareas diarias y pasar tiempo juntos.",
        "No hace falta conocer a todos de antemano. Una nueva amistad puede empezar con un simple saludo alrededor de la mesa.",
      ],
    };
    const largePhoto = document.querySelector("#large-photo");
    function updatePhotoStory() {
      const imageSource = largePhoto.getAttribute("src") || "";
      const photoIndex = Number(imageSource.match(/meeting-(\d+)/)?.[1] || 0);
      photoStory.textContent = photoStoriesByLanguage[language][photoIndex % 3];
    }

    photoCaption.after(photoStory);
    updatePhotoStory();
    new MutationObserver(updatePhotoStory).observe(largePhoto, {
      attributes: true,
      attributeFilter: ["src"],
    });
  }
})();
