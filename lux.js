const CALENDLY_URL = "https://calendly.com/a26companies/15min";

/**
 * Intersection-based reveals:
 * - Any element with .reveal will animate in.
 * - Any element with .stagger will animate its children in sequence.
 */
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

/**
 * Subtle parallax for “hero cards” or background bits.
 * Add data-parallax="0.06" (smaller = subtler).
 */
function initParallax() {
  const par = document.querySelectorAll("[data-parallax]");
  if (!par.length) return;

  const onScroll = () => {
    const y = window.scrollY || 0;
    par.forEach((el) => {
      const spd = parseFloat(el.getAttribute("data-parallax") || "0.06");
      // Negative so it floats upward slightly as you scroll down
      el.style.transform = `translateY(${y * spd * -1}px)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/**
 * Forces all Calendly CTAs to be absolute + consistent.
 * Any <a data-calendly> will open CALENDLY_URL in a new tab.
 */
function bindCalendlyLinks() {
  document.querySelectorAll("[data-calendly]").forEach((a) => {
    a.setAttribute("href", CALENDLY_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

/**
 * Keeps your Formspree submit -> redirect to Calendly flow.
 * Also fires GA event intake_submit (safe if GA isn't loaded).
 */
function bindIntakeForm() {
  const form = document.getElementById("intakeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Honeypot spam trap
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
    } catch (err) {
      alert("Network error. Please email products@a26cos.com.");
    }
  });
}

/**
 * Mobile dropdown menu:
 * - Hamburger button: .mobile-menu-toggle
 * - Menu container: #mobile-menu (also has class .mobile-menu)
 * - Shows/hides by toggling .is-open
 */
function initMobileMenu() {
  const btn = document.querySelector(".mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    close();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Close after clicking a menu link
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => close());
  });
}

/**
 * Page transitions (fade-out -> navigate) for internal HTML pages.
 * Add data-nav to links like: <a data-nav href="./services.html">Services</a>
 */
function initPageTransitions() {
  const overlay = document.querySelector(".pageFade");
  if (!overlay) return;

  // Start with overlay on in HTML; remove on load for fade-in
  requestAnimationFrame(() => overlay.classList.remove("on"));

  document.querySelectorAll("a[data-nav]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href) return;

      // Only handle same-folder html pages
      const isInternalHtml = !href.startsWith("http") && href.endsWith(".html");
      if (!isInternalHtml) return;

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

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  bindCalendlyLinks();
  bindIntakeForm();
  initMobileMenu();     // <-- ADDED
  initReveals();
  initParallax();
  initPageTransitions();
});
