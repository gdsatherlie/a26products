const CALENDLY_URL = "https://calendly.com/a26companies/15min";

function revealOnScroll(){
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

function bindCalendlyLinks(){
  document.querySelectorAll("[data-calendly]").forEach((a)=>{
    a.setAttribute("href", CALENDLY_URL);
    a.setAttribute("target","_blank");
    a.setAttribute("rel","noopener");
  });
}

function bindIntakeForm(){
  const form = document.getElementById("intakeForm");
  if(!form) return;

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const formData = new FormData(form);

    // Honeypot spam trap
    if (formData.get("_gotcha")) return;

    try{
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if(res.ok){
        if(typeof window.gtag === "function"){
          window.gtag("event", "intake_submit", {
            event_category: "lead",
            event_label: "product_intake"
          });
        }
        window.location.href = CALENDLY_URL;
        return;
      }

      alert("Submission failed. Please try again or email products@a26cos.com.");
    }catch(err){
      alert("Network error. Please email products@a26cos.com.");
    }
  });
}

function year(){
  const y = document.getElementById("y");
  if(y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", ()=>{
  year();
  bindCalendlyLinks();
  bindIntakeForm();
  revealOnScroll();
});
