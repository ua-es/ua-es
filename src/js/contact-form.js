export function initializeContactForm({
  querySelector,
  querySelectorAll,
  isPhoneNumber,
  isValidContactMethod,
  showDialog,
}) {
  const form = querySelector("#contact-form");
  const fields = form.elements;
  const result = querySelector("#contact-result");
  const purposeLabels = Object.fromEntries(
    ["join", "menu", "help", "support", "media", "talent", "feedback", "question", "privacy"].map(
      (purpose) => [purpose, window.i18n.t(`contact.purpose.${purpose}`)]
    )
  );

  function updateForm() {
    const isParticipation = fields.purpose.value === "join";
    const requiresMessage = ["help", "support", "media", "talent", "feedback"].includes(
      fields.purpose.value
    );

    querySelector(".review-consent").hidden = fields.purpose.value !== "feedback";
    querySelector("#contact-modal").dataset.variant = isParticipation
      ? "participation"
      : requiresMessage && fields.purpose.value !== "feedback"
        ? "collaboration"
        : "compact";
    querySelector(".participant-fields", form).hidden = !isParticipation;

    for (const fieldName of ["adults", "children"]) {
      fields[fieldName].required = isParticipation;
      fields[fieldName].disabled = !isParticipation;
    }

    fields.message.required = requiresMessage;
    querySelector("#message-label").textContent = requiresMessage
      ? window.i18n.t("contact.message.suggestionLabel")
      : window.i18n.t("contact.message.detailsLabel");
    fields.message.placeholder = isParticipation
      ? window.i18n.t("contact.message.joinPlaceholder")
      : window.i18n.t("contact.message.defaultPlaceholder");
    result.replaceChildren();
  }

  function updateContactMethod() {
    const methodSettings = {
      telegram: ["text", window.i18n.t("contact.method.telegramPlaceholder"), "off"],
      email: ["email", "you@example.com", "email"],
      phone: ["tel", "+34 600 000 000", "tel"],
    };
    const [type, placeholder, autocomplete] = methodSettings[fields.method.value];

    Object.assign(fields.contact, { type, placeholder, autocomplete });
    fields.contact.setCustomValidity("");
    result.replaceChildren();
  }

  function openContactForm(purpose, context = "") {
    const selectedPurpose = Object.hasOwn(purposeLabels, purpose) ? purpose : "question";

    querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    fields.purpose.value = selectedPurpose;
    fields.context.value = context;
    updateForm();
    querySelector("#contact-title").textContent = window.i18n.t(`contact.title.${selectedPurpose}`);
    if (context) {
      fields.message.placeholder = window.i18n.t("contact.message.contextPlaceholder", {
        context,
      });
    }
    showDialog(querySelector("#contact-modal"));
  }

  function showValidationError(field, messageKey) {
    field.setCustomValidity(window.i18n.t(messageKey));
    field.reportValidity();
  }

  function getRequestMessage({ name, city, contact, message, isParticipation }) {
    const optionalFields = ["availability", "transport", "diet", "contribution"].map(
      (fieldName) => {
        const value = fields[fieldName].value.trim();
        return value ? window.i18n.t(`request.${fieldName}`, { value }) : "";
      }
    );
    const messages = [
      window.i18n.t("request.greeting", { purpose: purposeLabels[fields.purpose.value] }),
      window.i18n.t("request.name", { name }),
      window.i18n.t("request.city", { city }),
      window.i18n.t("request.contact", {
        method: window.i18n.t(`contact.method.${fields.method.value}`),
        contact,
      }),
      fields.email?.value.trim()
        ? window.i18n.t("request.email", { email: fields.email.value.trim() })
        : "",
      fields.context.value.trim()
        ? window.i18n.t("request.context", { context: fields.context.value.trim() })
        : "",
      isParticipation
        ? window.i18n.t("request.participants", {
            adults: fields.adults.value,
            children: fields.children.value,
          })
        : "",
      ...optionalFields,
      message ? window.i18n.t("request.details", { details: message }) : "",
      fields.purpose.value === "feedback"
        ? window.i18n.t("request.reviewPermission", {
            answer: window.i18n.t(fields.publishReview.checked ? "request.yes" : "request.no"),
          })
        : "",
      window.i18n.t("request.replyConsent"),
      window.i18n.t("request.futureUpdates", {
        answer: window.i18n.t(fields.future.checked ? "request.yes" : "request.no"),
      }),
    ];

    return messages.filter(Boolean).join("\n");
  }

  async function copyRequest(message) {
    const status = querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = window.i18n.t("request.copy.success");
    } catch {
      let preview = querySelector(".message-preview", result);
      if (!preview) {
        preview = document.createElement("textarea");
        preview.className = "message-preview";
        preview.readOnly = true;
        preview.setAttribute("aria-label", window.i18n.t("request.copy.manualLabel"));
        result.append(preview);
      }

      preview.value = message;
      status.textContent = window.i18n.t("request.copy.failure");
    }
  }

  fields.purpose.addEventListener("change", updateForm);
  fields.method.addEventListener("change", updateContactMethod);
  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity("");
    }
    result.replaceChildren();
  });

  document.addEventListener("click", (event) => {
    const contactButton = event.target.closest("[data-contact]");
    if (contactButton) {
      openContactForm(contactButton.dataset.contact, contactButton.dataset.context || "");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = fields.name.value.trim();
    const city = fields.city.value.trim();
    const contact = fields.contact.value.trim();
    const message = fields.message.value.trim();

    if ((name.match(/\p{L}/gu) || []).length < 2) {
      showValidationError(fields.name, "contact.validation.name");
      return;
    }
    if (city.length < 2) {
      showValidationError(fields.city, "contact.validation.city");
      return;
    }

    const isPhoneContact = isPhoneNumber(contact);
    if (!isPhoneContact && !isValidContactMethod(fields.method.value, contact)) {
      showValidationError(fields.contact, "contact.validation.method");
      return;
    }
    if (fields.message.required && message.length < 5) {
      showValidationError(fields.message, "contact.validation.message");
      return;
    }
    if (isPhoneContact) fields.method.value = fields.method.options[1].value;

    const isParticipation = fields.purpose.value === "join";
    const requestMessage = getRequestMessage({ name, city, contact, message, isParticipation });
    const telegramUrl = `https://t.me/panda_dp?text=${encodeURIComponent(requestMessage)}`;
    result.innerHTML = `<p><strong>${window.i18n.t("request.telegram.opening")}</strong> ${window.i18n.t("request.telegram.sendHint")}</p><div class="actions"><a class="button" target="_blank" rel="noopener" href="${telegramUrl}">${window.i18n.t("request.telegram.openAgain")}</a><button class="text-button" type="button" id="copy-request">${window.i18n.t("request.copy.button")}</button></div><p id="copy-status" role="status"></p>`;
    querySelector("#copy-request").addEventListener("click", () => copyRequest(requestMessage));
    copyRequest(requestMessage);
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  });

  updateForm();
  updateContactMethod();
  return openContactForm;
}
