const $ = (s) => document.querySelector(s), cards = [...document.querySelectorAll("article")];
let group = "all", opener;
function filter() {
  const q = $("#search").value.trim().toLocaleLowerCase("en");
  let n = 0;
  cards.forEach((c) => {
    c.hidden = !(group === "all" || c.dataset.group === group) || !c.dataset.name.includes(q);
    if (!c.hidden) n++;
  });
  document.querySelectorAll(".media-section").forEach((section) => {
    section.hidden = ![...section.querySelectorAll("article")].some((card) => !card.hidden);
  });
  $("#count").textContent = `Items: ${n}`;
}
$("#search").addEventListener("input", filter);
document.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
  group = b.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  filter();
}));
$("#background").addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  $("#background").setAttribute("aria-pressed", String(dark));
  $("#background").textContent = dark ? "Light preview background" : "Dark preview background";
});
document.querySelectorAll("[data-src]").forEach((b) => b.addEventListener("click", () => {
  opener = b;
  $("#viewer-image").src = b.dataset.src;
  $("#viewer-image").alt = b.dataset.title;
  $("#viewer-title").textContent = b.dataset.title;
  $("#viewer-download").href = b.dataset.src;
  $("#viewer").showModal();
}));
$(".close").addEventListener("click", () => $("#viewer").close());
$("#viewer").addEventListener("close", () => opener?.focus());
$("#viewer").addEventListener("click", (e) => {
  if (e.target === $("#viewer")) {
    const r = e.target.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
  }
});
filter();
