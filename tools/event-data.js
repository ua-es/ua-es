/** Produce all date labels from the same instant in the venue's timezone. */
export function eventVariables(event, locale) {
  if (!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(event.startsAt)) {
    throw new Error("Event start must include an explicit timezone offset");
  }
  const startsAt = new Date(event.startsAt);
  if (!Number.isFinite(startsAt.getTime())) throw new Error("Invalid event start");
  const language = locale === "en" ? "en-GB" : locale;
  const options = { timeZone: event.timeZone };
  const dateParts = new Intl.DateTimeFormat(language, {
    ...options,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(startsAt);
  const yearIndex = dateParts.findIndex((part) => part.type === "year");
  const date = dateParts
    .slice(0, yearIndex + 1)
    .map((part) => part.value)
    .join("");
  const time = new Intl.DateTimeFormat(language, {
    ...options,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(startsAt);
  const month = new Intl.DateTimeFormat(language, { ...options, month: "long" }).format(startsAt);
  const url = new URL(event.mapUrl);
  if (url.protocol !== "https:") throw new Error("Event map must use HTTPS");
  return {
    "meeting.start": event.startsAt,
    "meeting.date": `${date} · ${time}`,
    "meeting.day": new Intl.DateTimeFormat(language, { ...options, day: "numeric" }).format(
      startsAt
    ),
    "meeting.month": month[0].toLocaleUpperCase(language) + month.slice(1),
    "meeting.venue": event.venue,
    "meeting.map-url": url.href,
  };
}
