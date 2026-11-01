import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../src/js/countdown.js", import.meta.url), "utf8");

function createCountdown(startDate, initialTime) {
  let now = Date.parse(initialTime);
  let tick;
  let intervalCleared = false;
  const listeners = {};
  const values = Object.fromEntries(
    ["days", "hours", "minutes", "seconds"].map((unit) => [unit, { textContent: "00" }])
  );
  const units = { hidden: false };
  const ended = { hidden: true };
  const root = {
    dataset: { eventStart: startDate },
    querySelector(selector) {
      const clock = selector.match(/^\[data-clock="(.*)"\]$/);
      if (clock) return values[clock[1]];
      if (selector === ".countdown-units") return units;
      if (selector === ".countdown-ended") return ended;
      return null;
    },
  };
  class FakeDate extends Date {
    static now() {
      return now;
    }
  }
  const window = {
    Date: FakeDate,
    document: {
      hidden: false,
      addEventListener(name, callback) {
        listeners[name] = callback;
      },
    },
    setInterval(callback, delay) {
      assert.equal(delay, 1000);
      tick = callback;
      return 1;
    },
    clearInterval() {
      intervalCleared = true;
    },
  };
  runInNewContext(source, { window, console });
  window.picnicCountdown.init(root);

  return {
    values,
    units,
    ended,
    listeners,
    tick: () => tick?.(),
    setNow(value) {
      now = Date.parse(value);
    },
    get intervalCleared() {
      return intervalCleared;
    },
  };
}

test("counts down using the event's explicit timezone", () => {
  const countdown = createCountdown("2026-11-28T11:00:00+01:00", "2026-11-27T09:00:00Z");

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(countdown.values).map(([unit, element]) => [unit, element.textContent])
    ),
    { days: "01", hours: "01", minutes: "00", seconds: "00" }
  );
  assert.equal(countdown.units.hidden, false);
  assert.equal(countdown.ended.hidden, true);
});

test("updates each second and shows the ended state at the event time", () => {
  const countdown = createCountdown("2026-11-28T11:00:00+01:00", "2026-11-28T09:59:59Z");

  assert.equal(countdown.values.seconds.textContent, "01");
  countdown.setNow("2026-11-28T10:00:00Z");
  countdown.tick();

  assert.equal(countdown.units.hidden, true);
  assert.equal(countdown.ended.hidden, false);
  assert.equal(countdown.values.seconds.textContent, "00");
  assert.equal(countdown.intervalCleared, true);
});

test("shows the ended state immediately when the event time has passed", () => {
  const countdown = createCountdown("2026-11-28T11:00:00+01:00", "2026-11-28T10:00:01Z");

  assert.equal(countdown.units.hidden, true);
  assert.equal(countdown.ended.hidden, false);
  assert.equal(countdown.values.seconds.textContent, "00");
});
