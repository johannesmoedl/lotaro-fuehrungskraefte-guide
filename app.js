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

// ---------- Live-Trainingsdaten (ARLO Public API) ----------
const ARLO_PLATFORM = "lotaro-mvp";
const ARLO_EVENTSEARCH_URL = `https://${ARLO_PLATFORM}.arlo.co/api/2012-02-01/pub/resources/eventsearch/`;

// Arlo-Kategoriename -> Kategorie-ID in CATEGORIES
const ARLO_CATEGORY_MAP = {
  Communication: "kommunikation",
  Leadership: "leadership",
  "AI Skills": "ai-skills",
  "Mental Health": "mental-health",
  "Personal Development": "persoenliche-entwicklung",
  Productivity: "produktivitaet",
  "Sales & Negotiation": "sales-verhandlungen",
};

// Arlo führt jedes Training doppelt (DE/EN), erkennbar am Code-Suffix
// (z.B. "PROMGER-018" vs. "PROMENG-009"). Der Guide ist deutschsprachig,
// also nur die GER-Variante übernehmen.
function isGermanEvent(event) {
  return /GER-\d+$/.test(event.Code || "");
}

const LOW_PLACES_THRESHOLD = 3;

function arloAvailability(event) {
  if (event.IsFull) return { label: "Ausgebucht", cls: "full" };
  if (typeof event.PlacesRemaining === "number" && event.PlacesRemaining <= LOW_PLACES_THRESHOLD) {
    return { label: "Wenige Plätze frei", cls: "low" };
  }
  return { label: "Plätze frei", cls: "open" };
}

async function fetchArloTrainings() {
  const trainingsByCategory = {};
  let skip = 0;
  const pageSize = 100;

  for (let page = 0; page < 5; page++) {
    const url = `${ARLO_EVENTSEARCH_URL}?format=json&top=${pageSize}&skip=${skip}&fields=Name,Code,Presenters,Categories,ViewUri,EventID,IsFull,PlacesRemaining`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Arlo API ${res.status}`);
    const data = await res.json();
    const items = data.Items || [];

    for (const event of items) {
      if (!isGermanEvent(event)) continue;
      const arloCategory = event.Categories?.[0]?.Name;
      const categoryId = ARLO_CATEGORY_MAP[arloCategory];
      if (!categoryId) continue;

      const list = (trainingsByCategory[categoryId] ??= new Map());
      if (!list.has(event.Name)) {
        const trainer = (event.Presenters || []).map((p) => p.Name).join(" & ") || "—";
        // ViewUri zeigt auf die allgemeine Kursseite (/courses/{slug}); der
        // Trainingskatalog verlinkt Trainings konkret auf /w/events/{slug}/{EventID}
        // – dort landet man direkt bei diesem Training samt Terminen & Buchung.
        const catalogUrl = event.ViewUri
          ? `${event.ViewUri.replace("/courses/", "/w/events/")}/${event.EventID}`
          : null;
        list.set(event.Name, { title: event.Name, trainer, url: catalogUrl, status: arloAvailability(event) });
      }
    }

    if (items.length < pageSize) break;
    skip += pageSize;
  }

  return trainingsByCategory;
}

async function loadLiveTrainings() {
  try {
    const trainingsByCategory = await fetchArloTrainings();
    for (const cat of CATEGORIES) {
      const live = trainingsByCategory[cat.id];
      if (live && live.size > 0) {
        cat.trainings = [...live.values()].sort((a, b) => a.title.localeCompare(b.title, "de"));
      }
    }
    renderMatrix();
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    console.warn("Arlo-Live-Daten nicht verfügbar, zeige Offline-Fallback:", err);
  }
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
        ${cat.trainings
          .map(
            (t) => `<li>
              <div class="training-title">
                ${t.url ? `<a href="${t.url}" target="_blank" rel="noopener">${t.title}</a>` : `<span>${t.title}</span>`}
              </div>
              <div class="training-meta">
                ${t.status ? `<span class="status-pill status-${t.status.cls}">${t.status.label}</span>` : ""}
                <span class="trainer">${t.trainer}</span>
              </div>
            </li>`
          )
          .join("")}
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

// ---------- PDF-Export ----------
// In einem eingebetteten iFrame (z.B. Notion /embed) ist der Browser meist
// "sandboxed" und blockiert window.print() lautlos (kein Fehler, nichts
// passiert). Deshalb dort in einem neuen, nicht-sandboxed Tab öffnen und den
// Druckdialog dort automatisch auslösen (?autoprint=1, siehe unten).
function initPdfExport() {
  document.getElementById("pdf-download-btn")?.addEventListener("click", () => {
    if (window.self !== window.top) {
      const url = new URL(window.location.href);
      url.searchParams.set("autoprint", "1");
      window.open(url.toString(), "_blank");
    } else {
      window.print();
    }
  });
}

function initAutoPrint() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("autoprint") !== "1") return;
  window.history.replaceState({}, "", window.location.pathname);
  window.addEventListener("load", () => setTimeout(() => window.print(), 300));
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSlideshow();
  initPdfExport();
  initAutoPrint();
  renderLeitfaden();
  renderMatrix();
  renderObjections();
  renderReview();
  if (window.lucide) lucide.createIcons();
  loadLiveTrainings();
});
