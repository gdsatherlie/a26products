// /v2/app.js
const CALENDLY_URL = "https://calendly.com/a26companies/15min";

function bindIntakeForm() {
  const form = document.querySelector('form[data-intake-form="true"]');
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently fail (spam)
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value) return;

    try {
      const formData = new FormData(form);

      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        // Optional: fire GA event if gtag exists
        if (typeof window.gtag === "function") {
          window.gtag("event", "intake_submit", { event_category: "conversion" });
        }
        window.location.href = CALENDLY_URL;
      } else {
        alert("Submission failed. Please try again or email products@a26cos.com.");
      }
    } catch (err) {
      alert("Network error. Please email products@a26cos.com.");
    }
  });
}

function bindCalendlyLinks() {
  // Any link/button with data-calendly will be forced to the correct absolute URL
  document.querySelectorAll("[data-calendly]").forEach((el) => {
    if (el.tagName.toLowerCase() === "a") el.href = CALENDLY_URL;
    el.addEventListener("click", (e) => {
      // allow normal link behavior for <a>, but for buttons we redirect
      if (el.tagName.toLowerCase() !== "a") {
        e.preventDefault();
        window.location.href = CALENDLY_URL;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindIntakeForm();
  bindCalendlyLinks();
});
