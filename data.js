// Zentrale Datenbasis für den Führungskräfte-Guide.
//
// Die `trainings`-Arrays je Kategorie sind der Offline-Fallback (Stand
// 17.08.2026, manuell gegen den Trainingskatalog abgeglichen). Beim Laden
// ersetzt app.js sie pro Kategorie durch aktuelle Daten aus der ARLO Public
// API (siehe fetchArloTrainings() in app.js) – nur wenn der Live-Abruf für
// eine Kategorie fehlschlägt oder leer bleibt, greift dieser Fallback.

const CATEGORIES = [
  {
    id: "kommunikation",
    icon: "message-circle",
    name: "Kommunikation",
    diagnose: "Geht es primär um menschliche Interaktion? (Missverständnisse, Gespräche, Wirkung)",
    problem: "Missverständnisse, unausgesprochene Konflikte, Unsicherheit in Gesprächen",
    loesung: "Klare Botschaften, souveräne Auftritte, respektvolle & wirksame Kommunikation",
    trainings: [
      { title: "Konfliktlösung – Meistere schwierige Gespräche", trainer: "Maximilian Gracz" },
      { title: "Wie du deutliches Feedback selbstbewusst vermittelst", trainer: "Maik Frank" },
      { title: "Spontan reden, souverän begeistern – ganz ohne Skript", trainer: "Michael Geerdts" },
      { title: "Überzeugen & motivieren mit respektvoller Kommunikation", trainer: "Martin Schaible" },
      { title: "Wer fragt, der führt – Fragetechniken aus dem NLP", trainer: "Johannes Mödl" },
    ],
  },
  {
    id: "leadership",
    icon: "compass",
    name: "Leadership",
    diagnose: "Bleiben Entscheidungen liegen? Wird wenig Verantwortung übernommen? Steht ein Wechsel in eine Führungsrolle an? Fehlt eine Feedback-Kultur?",
    problem: "Operative Überlastung, Mikromanagement, Unsicherheit in der Führungsrolle",
    loesung: "Klare Verantwortung, entlastete Führung, wirksame & moderne Zusammenarbeit",
    trainings: [
      { title: "Leadership Kickstart: Fit für die erste Führungsrolle", trainer: "Franziska Seidel" },
      { title: "Kernkompetenzen erfolgreicher Führung: Wirksam & praxisnah", trainer: "Michael Krautwald" },
      { title: "Lead smart: Delegieren statt überlasten", trainer: "Michael Krautwald" },
      { title: "Coachen als Führungskraft: Wie du jeden coachen kannst", trainer: "Maik Frank" },
      { title: "Female Leadership: Souverän auftreten & kommunizieren", trainer: "Eva Baumgartner" },
      { title: "Change gestalten: Systematisch, wirksam, persönlich", trainer: "Maximilian Gracz" },
    ],
  },
  {
    id: "ai-skills",
    icon: "bot",
    name: "AI Skills",
    diagnose: "Geht es um den Umgang mit KI, Tools oder neuen Arbeitsweisen? Hemmungen im Umgang mit KI?",
    problem: "Zeitverlust durch manuelle Routinen, Unsicherheit im Umgang mit KI-Tools",
    loesung: "Souveräner KI-Einsatz, smarte Automatisierung, spürbare Effizienz im Alltag",
    trainings: [
      { title: "Smart statt hart: Wie KI dir die Arbeit vereinfacht", trainer: "Jan-Philipp Krum" },
      { title: "Co-Pilot Control: KI-Upgrade für Word, Excel & Outlook", trainer: "Martin Schaible" },
      { title: "KI-Agenten in Aktion: Vom Hype zur praktischen Anwendung", trainer: "Nikolaj Ivanov" },
      { title: "Prompt like a Pro! Schreib KI so, dass sie dich versteht", trainer: "Jan-Philipp Krum" },
      { title: "Superhuman durch KI – Dein Upgrade für den Joballtag", trainer: "Martin Schaible" },
      { title: "KI für Präsentationen – Visuell überzeugen in Minuten", trainer: "Jan-Philipp Krum" },
    ],
  },
  {
    id: "mental-health",
    icon: "heart-pulse",
    name: "Mental Health",
    diagnose: "Geht es um Stressabbau, Resilienz oder innere Balance?",
    problem: "Dauerstress, Burnout-Risiko, fehlende Abgrenzung, mentale Überlastung",
    loesung: "Innere Ruhe, Resilienz, klare Grenzen, spürbare Entlastung",
    trainings: [
      { title: "Resilienz – Gelassenheit bei Stress und Ärger", trainer: "Luka Faradsch" },
      { title: "Stressfrei im Job: Achtsamkeit für Fokus & Gelassenheit", trainer: "Sandra Mederer" },
      { title: "Reset nach der Arbeit: Resilienz-Strategien für innere Ruhe", trainer: "Johannes Mödl" },
      { title: "Einführung in Meditation – Ruhe & Klarheit statt Stress", trainer: "Johannes Mödl" },
      { title: "Nein sagen & Grenzen setzen: Schluss mit People Pleasing", trainer: "Luka Faradsch" },
      { title: "Mental Load managen & reduzieren: Für spürbare Entlastung", trainer: "Aurelia Hack" },
    ],
  },
  {
    id: "persoenliche-entwicklung",
    icon: "sprout",
    name: "Persönliche Entwicklung",
    diagnose: "Geht es um Selbstvertrauen, Mindset oder persönliches Wachstum?",
    problem: "Selbstzweifel, Imposter-Syndrom, limitierende Überzeugungen, fehlende Klarheit",
    loesung: "Selbstvertrauen, Growth Mindset, klare Stärken, innere Sicherheit",
    trainings: [
      { title: "Overcoming Self-Doubt: Challenging Your Inner Critic", trainer: "Helen Barnes" },
      { title: "Mindset: Mehr Motivation, Klarheit und Selbstvertrauen", trainer: "Johannes Mödl" },
      { title: "Growth Mindset: Wie dein Denken über Erfolg entscheidet", trainer: "Thekla Piper" },
      { title: "Entdecke deine Stärken – arbeite leichter & besser", trainer: "Sandra Dettweiler" },
      { title: "Selbstwert erkennen: Mehr Selbstvertrauen und Resilienz", trainer: "Johannes Mödl" },
    ],
  },
  {
    id: "produktivitaet",
    icon: "zap",
    name: "Produktivität",
    diagnose: "Geht es um Zeitmanagement, Fokus oder Effizienz?",
    problem: "Zeitverschwendung, fehlender Fokus, Ablenkung, Chaos im Alltag",
    loesung: "Klare Prioritäten, volle Konzentration, spürbare Effizienz, innere Ordnung",
    trainings: [
      { title: "Priorisieren & Fokussieren – zwei Produktivitätsbooster", trainer: "Jan-Philipp Krum" },
      { title: "Fokus statt Chaos: Selbstmanagement im hektischen Alltag", trainer: "Anna Wörner" },
      { title: "Endlich konzentriert arbeiten – trotz Mails & Smartphone", trainer: "Sandra Mederer" },
      { title: "Selbstmanagement: Zeit gewinnen & Stress reduzieren", trainer: "Michael Krautwald" },
    ],
  },
  {
    id: "sales-verhandlungen",
    icon: "handshake",
    name: "Sales & Verhandlungen",
    diagnose: "Geht es um Verkauf, Verhandlung oder Überzeugungskraft?",
    problem: "Schwache Verhandlungsergebnisse, fehlende Überzeugungskraft, Einwände nicht gelöst",
    loesung: "Sichere Verhandlungen, starke Präsenz, Win-Win-Lösungen, überzeugende Kommunikation",
    trainings: [
      { title: "Cold Calling Mastery: Qualifizierte Leads generieren", trainer: "Benedikt Meuthen" },
      { title: "Überzeugen & motivieren mit respektvoller Kommunikation", trainer: "Martin Schaible" },
      { title: "Verhandlungen meistern: Strategien und Techniken", trainer: "Rodney Younce" },
      { title: "Storytelling – Verkaufen durch Faszination statt Fakten", trainer: "Martin Schaible" },
    ],
  },
];

// Einwandbehandlung – überarbeitete Fassung (Coaching-Haltung: erst spiegeln,
// dann eine offene Frage stellen, keine Lösung im selben Atemzug anbieten).
const OBJECTIONS = [
  {
    einwand: "Ich habe keine Zeit.",
    varianten: [
      "Klingt, als wäre dein Tag aktuell eng getaktet. Wenn du dir eine Sache aus deinem Alltag wegwünschen könntest, um wieder Luft zu haben – welche wäre das?",
      "Verstehe. Was müsste passieren, damit sich 2 Stunden für dich lohnen würden?",
    ],
  },
  {
    einwand: "Trainings bringen eh nichts.",
    varianten: [
      "Fair. Wann hast du zuletzt wirklich etwas gelernt, das im Alltag hängengeblieben ist – was war da anders?",
      "Was genau hat sich beim letzten Mal nicht gelohnt?",
    ],
  },
  {
    einwand: "Jetzt ist kein guter Zeitpunkt.",
    varianten: [
      "Klingt, als hättest du gerade wenig Kapazität für was Zusätzliches. Wollen wir das Thema einfach unbelastet beim nächsten 1:1 wieder aufgreifen, oder gibt's einen Zeitpunkt, der dir besser passt?",
    ],
  },
];

const GESPRAECHSLEITFADEN = [
  {
    step: 1,
    title: "Ist-Zustand erfassen",
    frage: "Wenn du an die letzten Wochen denkst: Was kostet dich beim Drumherum aktuell am meisten Zeit, Energie oder Nerven?",
    optional: "In welchen konkreten Situationen zeigt sich das besonders?",
  },
  {
    step: 2,
    title: "Perspektive erweitern",
    frage: "Welche eine Fähigkeit würde dich dabei unterstützen, deine fachliche Kompetenz noch wirksamer werden zu lassen?",
    optional: "Was würden Kollegen vermutlich sagen: Worin bist du verlässlich stark – und wo könntest du noch souveräner wirken?",
  },
  {
    step: 3,
    title: "Lernfeld definieren",
    frage: "Wenn du in die nächsten Monate schaust: Welche Fähigkeit wird für deine Rolle spürbar wichtiger?",
    optional: "Was würde dich in deiner aktuellen Rolle stärken?",
  },
  {
    step: 4,
    title: "Interesse berücksichtigen",
    frage: "Wenn du einen Themenbereich frei wählen könntest: Welcher reizt dich am meisten?",
  },
  {
    step: 5,
    title: "Entscheidung & Training finden",
    frage: "Was hältst du davon, wenn du mit diesen Gedanken im Hinterkopf 1–2 LOTARO-Trainings raussuchst?",
    optional: "Lass uns beim nächsten 1:1 kurz darüber reden.",
  },
];

const REVIEW_FRAGEN = [
  { title: "Transfer sichern", frage: "Was nimmst du aus dem Training für dich mit?", optional: "Was wird dadurch besser/leichter für dich?" },
  { title: "Anwendungsfelder", frage: "In welchen Situationen kann dir das zukünftig helfen?" },
  { title: "Perspektive schaffen", frage: "Welches Training macht für dich als nächstes Sinn?" },
];
