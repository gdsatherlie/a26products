// lux.js — reveal-on-scroll + optional subtle UX polish
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function inView(el, offset = 0.12) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top <= vh * (1 - offset);
  }

  function tick() {
    const reveals = document.querySelectorAll(".reveal:not(.in)");
    reveals.forEach((el) => {
      if (inView(el)) el.classList.add("in");
    });

    const staggers = document.querySelectorAll(".stagger:not(.in)");
    staggers.forEach((el) => {
      if (inView(el, 0.18)) el.classList.add("in");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (prefersReduced) {
      document.querySelectorAll(".reveal, .stagger").forEach((el) => el.classList.add("in"));
      return;
    }
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  });
})();
