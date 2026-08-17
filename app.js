// ---------- Tab-Umschaltung ----------
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById(btn.dataset.target).classList.add("active");
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    });
  });
}

// ---------- Slideshow ----------
let currentSlide = 0;
let totalSlides = 0;

function initSlideshow() {
  const slides = document.querySelectorAll("#slideshow-view .slide");
  totalSlides = slides.length;
  document.getElementById("slide-total").textContent = totalSlides;

  document.getElementById("prev-slide").addEventListener("click", () => goToSlide(currentSlide - 1));
  document.getElementById("next-slide").addEventListener("click", () => goToSlide(currentSlide + 1));

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("slideshow-view").classList.contains("active")) return;
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
  });

  goToSlide(0);
}

function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  document.querySelectorAll("#slideshow-view .slide").forEach((s, i) => {
    s.classList.toggle("active", i === index);
  });
  currentSlide = index;
  document.getElementById("slide-current").textContent = index + 1;
  document.getElementById("prev-slide").disabled = index === 0;
  document.getElementById("next-slide").disabled = index === totalSlides - 1;
  document.getElementById("progress-fill").style.width = `${((index + 1) / totalSlides) * 100}%`;
}

// ---------- Guide / Matrix (aus data.js) ----------
function renderLeitfaden() {
  const el = document.getElementById("leitfaden-list");
  el.innerHTML = GESPRAECHSLEITFADEN.map(
    (item) => `
    <div class="leitfaden-item">
      <div class="step-num">${item.step}</div>
      <div class="card">
        <h3 style="margin-bottom: 8px;">${item.title}</h3>
        <p class="review-q">„${item.frage}"</p>
        ${item.optional ? `<p class="review-q">„${item.optional}"</p>` : ""}
      </div>
    </div>`
  ).join("");
}

function renderMatrix() {
  const el = document.getElementById("matrix-grid");
  el.innerHTML = CATEGORIES.map(
    (cat) => `
    <div class="card matrix-card">
      <div class="cat-header">
        <div class="icon-badge"><i data-lucide="${cat.icon}"></i></div>
        <h3>${cat.name}</h3>
      </div>
      <p class="diagnose">„${cat.diagnose}"</p>
      <div class="problem-loesung">
        <div class="problem"><div class="label">Weniger</div><div>${cat.problem}</div></div>
        <div class="loesung"><div class="label">Mehr</div><div>${cat.loesung}</div></div>
      </div>
      <ul class="training-list">
        ${cat.trainings.map((t) => `<li><span>${t.title}</span><span class="trainer">${t.trainer}</span></li>`).join("")}
      </ul>
    </div>`
  ).join("");
}

function renderObjections() {
  const el = document.getElementById("objection-grid");
  el.innerHTML = OBJECTIONS.map(
    (o) => `
    <div class="card card-cream objection-card">
      <div class="einwand">„${o.einwand}"</div>
      ${o.varianten.map((v) => `<div class="variante">${v}</div>`).join("")}
    </div>`
  ).join("");
}

function renderReview() {
  const el = document.getElementById("review-grid");
  el.innerHTML = REVIEW_FRAGEN.map(
    (r) => `
    <div class="card">
      <h3 style="font-size:16px; margin-bottom:8px;">${r.title}</h3>
      <p class="review-q">„${r.frage}"</p>
      ${r.optional ? `<p class="review-q">„${r.optional}"</p>` : ""}
    </div>`
  ).join("");
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSlideshow();
  renderLeitfaden();
  renderMatrix();
  renderObjections();
  renderReview();
  if (window.lucide) lucide.createIcons();
});
