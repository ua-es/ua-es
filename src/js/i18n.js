(() => {
  const messages = window.localeMessages;
  const locale = document.documentElement.lang;

  if (!messages || typeof messages !== "object" || Array.isArray(messages)) {
    throw new Error(`Translation catalog is missing for locale "${locale}".`);
  }

  function translate(key, values = {}) {
    const message = key.split(".").reduce((branch, segment) => {
      if (!branch || typeof branch !== "object" || !Object.hasOwn(branch, segment)) {
        return undefined;
      }
      return branch[segment];
    }, messages);
    if (typeof message !== "string") {
      throw new Error(`Missing translation "${key}" for locale "${locale}".`);
    }

    return message.replace(/\{(\w+)\}/g, (placeholder, name) => {
      if (!Object.prototype.hasOwnProperty.call(values, name)) {
        throw new Error(`Missing value "${name}" for translation "${key}".`);
      }
      return String(values[name]);
    });
  }

  window.i18n = Object.freeze({ t: translate });
})();
