// v2/app.js
const CALENDLY_URL = "https://calendly.com/a26companies/15min";

function bindCalendlyLinks() {
  document.querySelectorAll("[data-calendly]").forEach((el) => {
    if (el.tagName.toLowerCase() === "a") {
      el.setAttribute("href", CALENDLY_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(CALENDLY_URL, "_blank", "noopener");
      });
    }
  });
}

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
        // GA event
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

document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  bindCalendlyLinks();
  bindIntakeForm();
});
