((global) => {
  const units = ["days", "hours", "minutes", "seconds"];

  function getRemaining(now, startsAt) {
    const totalSeconds = Math.max(0, Math.floor((startsAt - now) / 1000));

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor(totalSeconds / 3600) % 24,
      minutes: Math.floor(totalSeconds / 60) % 60,
      seconds: totalSeconds % 60,
      ended: now >= startsAt,
    };
  }

  function init(root) {
    if (!root) return;

    const startsAt = Date.parse(root.dataset.eventStart);
    if (!Number.isFinite(startsAt)) {
      console.error("Invalid event start date for countdown:", root.dataset.eventStart);
      return;
    }

    const values = Object.fromEntries(
      units.map((unit) => [unit, root.querySelector(`[data-clock="${unit}"]`)])
    );
    const countdownUnits = root.querySelector(".countdown-units");
    const endedMessage = root.querySelector(".countdown-ended");
    if (units.some((unit) => !values[unit]) || !countdownUnits || !endedMessage) {
      console.error("Countdown markup is incomplete.");
      return;
    }

    let interval;
    function render() {
      const remaining = getRemaining(global.Date.now(), startsAt);
      for (const unit of units) {
        values[unit].textContent = String(remaining[unit]).padStart(2, "0");
      }
      countdownUnits.hidden = remaining.ended;
      endedMessage.hidden = !remaining.ended;
      if (remaining.ended && interval !== undefined) global.clearInterval(interval);
    }

    render();
    if (global.Date.now() < startsAt) interval = global.setInterval(render, 1000);
    global.document.addEventListener("visibilitychange", () => {
      if (!global.document.hidden) render();
    });
  }

  global.picnicCountdown = { getRemaining, init };
})(window);
