const CALENDLY_URL = "https://calendly.com/a26companies/15min";

/* =========================
   REVEALS
========================= */
function initReveals() {
  const els = document.querySelectorAll(".reveal, .stagger");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });

  els.forEach(el => io.observe(el));
}

/* =========================
   PARALLAX
========================= */
function initParallax() {
  const par = document.querySelectorAll("[data-parallax]");
  if (!par.length) return;

  const onScroll = () => {
    const y = window.scrollY || 0;
    par.forEach((el) => {
      const spd = parseFloat(el.getAttribute("data-parallax") || "0.06");
      el.style.transform = `translateY(${y * spd * -1}px)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================
   CALENDLY
========================= */
function bindCalendlyLinks() {
  document.querySelectorAll("[data-calendly]").forEach((a) => {
    a.setAttribute("href", CALENDLY_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

/* =========================
   INTAKE FORM
========================= */
function bindIntakeForm() {
  const form = document.getElementById("intakeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    if (formData.get("_gotcha")) return;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "intake_submit", {
            event_category: "lead",
            event_label: "product_intake"
          });
        }
        window.location.href = CALENDLY_URL;
        return;
      }

      alert("Submission failed. Please try again or email products@a26cos.com.");
    } catch {
      alert("Network error. Please email products@a26cos.com.");
    }
  });
}

/* =========================
   MOBILE MENU (FIXED)
========================= */
function initMobileMenu() {
  const btn = document.querySelector(".mobile-menu-toggle");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // ALWAYS re-find the menu next to the header
    const menu = document.querySelector("header + .mobile-menu");
    if (!menu) return;

    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close on outside click
  document.addEventListener("click", () => {
    const menu = document.querySelector("header + .mobile-menu");
    if (!menu) return;
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const menu = document.querySelector("header + .mobile-menu");
    if (!menu) return;
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });
}

/* =========================
   PAGE TRANSITIONS
========================= */
function initPageTransitions() {
  const overlay = document.querySelector(".pageFade");
  if (!overlay) return;

  requestAnimationFrame(() => overlay.classList.remove("on"));

  document.querySelectorAll("a[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("http") || !href.endsWith(".html")) return;

      e.preventDefault();
      overlay.classList.add("on");
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
}

function setYear() {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  bindCalendlyLinks();
  bindIntakeForm();
  initMobileMenu();
  initReveals();
  initParallax();
  initPageTransitions();
});
