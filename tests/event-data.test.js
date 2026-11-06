import assert from "node:assert/strict";
import test from "node:test";
import { eventVariables } from "../tools/event-data.js";

const event = {
  startsAt: "2026-12-31T23:30:00Z",
  timeZone: "Europe/Madrid",
  venue: "Las Graveras",
  mapUrl: "https://example.com/map",
};

test("event labels use the venue timezone across a year boundary", () => {
  const values = eventVariables(event, "en");
  assert.equal(values["meeting.date"], "1 January 2027 · 00:30");
  assert.equal(values["meeting.day"], "1");
  assert.equal(values["meeting.month"], "January");
  assert.equal(values["meeting.start"], event.startsAt);
});

test("event dates require an offset and a valid timezone", () => {
  assert.throws(
    () => eventVariables({ ...event, startsAt: "2026-12-31T23:30:00" }, "en"),
    /timezone offset/
  );
  assert.throws(() => eventVariables({ ...event, timeZone: "Invalid/Zone" }, "en"), RangeError);
});
