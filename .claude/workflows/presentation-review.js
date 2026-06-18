export const meta = {
  name: 'presentation-review',
  description: 'Bewertet FutureMe aus Business- und Präsentationsperspektive: TR-Branding, USP-Klarheit, Demo-Readiness',
  whenToUse: 'Vor dem Präsentationstag ausführen — bewertet Pitch-Stärke, Business-Narrative und Demo-Risiken',
  phases: [
    { title: 'Lesen', detail: 'App-Code und Flows einlesen' },
    { title: 'Business-Analyse', detail: '5 unabhängige Perspektiven parallel bewerten' },
    { title: 'Demo-Synthese', detail: 'Präsentations-Scorecard und Action Items' },
  ],
};

// ─── Strategischer Kontext ────────────────────────────────────────────────────
// FutureMe ist ein Uniprojekt im Modul "Digital Business Innovation".
// Das Team agiert als Trade Republic Innovationsteam und entwickelt eine
// Altersvorsorge-App ("Unterapp") für den deutschen Otto Normalverbraucher (25–45 Jahre,
// kein Finanzwissen, verdrängt das Thema Rente).
//
// VERTEILUNGSSTRATEGIE:
//   (A) Unterapp in der bestehenden TR App — primäres Modell, greift auf 8M+ DE-User zu
//   (B) Standalone App im App Store unter TR-Brand — Reichweite für Non-TR-User
//
// BUSINESS CASE:
//   Nutzer entdeckt Rentenlücke → versteht Handlungsbedarf →
//   investiert über TR-Depot (ETF, bAV) → TR verdient an Transaktionen & AUM
//
// USPs:
//   1. KI-Analyse des Rentenbescheids in Sekunden
//   2. Klare Sprache, kein Fachjargon — "Rente für alle"
//   3. Direkt über TR investieren — nahtloser Loop
//
// Am Präsentationstag wird eine Live-Demo gezeigt. Die App muss überzeugen,
// ohne erklärenden Text — der Demo-Flow ist das Pitch-Deck.
// ─────────────────────────────────────────────────────────────────────────────

const STRATEGIE_KONTEXT = `
Du analysierst FutureMe, eine App des Trade Republic Innovationsteams, die als "Unterapp" innerhalb der TR-App oder als eigenständige App im App Store (unter dem TR-Brand) verteilt werden soll.

Zielgruppe: Otto Normalverbraucher, 25–45 Jahre, kein Finanzwissen, verdrängt das Thema Rente.

Business Case: Nutzer entdeckt Rentenlücke → versteht es → investiert über TR → TR verdient an AUM & Transaktionen.

Die App wird am Präsentationstag live vor einem Publikum (Hochschulmodul "Digital Business Innovation") demonstriert. Eine Live-Demo ohne Folien-Support. Bewertet aus dieser Perspektive.
`;

const SCHEMA = {
  type: 'object',
  required: ['dimension', 'score', 'staerken', 'schwaechen', 'empfehlungen', 'demo_risiken'],
  properties: {
    dimension: { type: 'string' },
    score: { type: 'number', minimum: 1, maximum: 10 },
    staerken: { type: 'array', items: { type: 'string' } },
    schwaechen: { type: 'array', items: { type: 'string' } },
    empfehlungen: { type: 'array', items: { type: 'string' } },
    demo_risiken: { type: 'array', items: { type: 'string', description: 'Was kann während der Live-Demo schiefgehen oder das Publikum verwirren?' } },
  },
};

// ─── Phase 1: Einlesen ────────────────────────────────────────────────────────

phase('Lesen')

const files = await parallel([
  () => agent('Lies src/app/App.tsx vollständig und gib den kompletten Inhalt zurück.', { label: 'read:App.tsx', effort: 'low' }),
  () => agent('Lies src/app/components/custom/AIOnboarding.tsx vollständig.', { label: 'read:AIOnboarding.tsx', effort: 'low' }),
  () => agent('Lies src/app/components/custom/Onboarding.tsx vollständig.', { label: 'read:Onboarding.tsx', effort: 'low' }),
  () => agent('Lies src/app/components/custom/InvestView.tsx und src/app/components/custom/SimulateView.tsx vollständig.', { label: 'read:InvestView+SimulateView', effort: 'low' }),
  () => agent('Lies src/app/components/custom/OptimizationPlan.tsx vollständig.', { label: 'read:OptimizationPlan', effort: 'low' }),
]);

const [appCode, aiOnboardingCode, onboardingCode, featureCode, optimizeCode] = files;
const codeContext = `
=== App.tsx ===
${appCode}

=== AIOnboarding.tsx ===
${aiOnboardingCode}

=== Onboarding.tsx ===
${onboardingCode}

=== InvestView + SimulateView ===
${featureCode}

=== OptimizationPlan ===
${optimizeCode}
`;

// ─── Phase 2: Business-Analyse ────────────────────────────────────────────────

phase('Business-Analyse')

const analysen = await parallel([

  () => agent(`
${STRATEGIE_KONTEXT}

Analysiere die App aus der Perspektive: **TR-Brand-Verankerung & Unterapp-Konzept**.

Fragen:
- Ist auf den ersten 3 Sekunden der Demo klar, dass dies ein Trade Republic Produkt ist?
- Kommuniziert die App das "Unterapp"-Konzept (Nutzer kommt aus der TR-App in FutureMe)?
- Gibt es einen sichtbaren Loop zurück zu TR ("Jetzt über TR investieren")?
- Fühlt sich die App visuell wie ein TR-Produkt an (Qualität, Tonalität, Minimalismus)?
- Würde das Publikum verstehen, warum TR das bauen würde (Business Case erkennbar)?

Code:
${codeContext}
  `, { label: 'analyse:tr-branding', schema: SCHEMA, effort: 'medium', phase: 'Business-Analyse' }),

  () => agent(`
${STRATEGIE_KONTEXT}

Analysiere die App aus der Perspektive: **USP-Klarheit & erster Eindruck**.

Die 3 USPs sind:
1. KI analysiert Rentenbescheid in Sekunden
2. Klare Sprache, kein Fachjargon
3. Direkt über TR investieren

Fragen:
- Sind alle 3 USPs innerhalb der ersten 30 Sekunden der Demo sichtbar oder spürbar?
- Wird USP 1 (KI) während des Onboardings ausreichend inszeniert?
- Werden die USPs als Benefits formuliert (Nutzer-Perspektive) oder als Features?
- Welcher USP ist am stärksten verankert, welcher am schwächsten?

Code:
${codeContext}
  `, { label: 'analyse:usp-clarity', schema: SCHEMA, effort: 'medium', phase: 'Business-Analyse' }),

  () => agent(`
${STRATEGIE_KONTEXT}

Analysiere die App aus der Perspektive: **Demo-Narrative & Story Arc**.

Der Kern der Demo-Story ist: "Ich weiß nicht, wie es um meine Rente steht" → "Ich verstehe meine Lücke" → "Ich weiß, wie ich sie schließe" → "Ich handle sofort (via TR)".

Fragen:
- Zieht sich diese Erzählung sichtbar durch die App?
- Gibt es einen "Aha-Moment" — den einen Screen, der das Publikum überzeugt?
- Ist der Übergang von "Problem verstehen" zu "Lösung anbieten" zu "Handeln" nahtlos?
- Welche Screens könnten das Publikum während der Demo verwirren oder zögern lassen?
- Gibt es einen emotionalen Peak (Rentenlücke-Erkennung, Lückenschließung)?

Code:
${codeContext}
  `, { label: 'analyse:demo-narrative', schema: SCHEMA, effort: 'medium', phase: 'Business-Analyse' }),

  () => agent(`
${STRATEGIE_KONTEXT}

Analysiere die App aus der Perspektive: **Zielgruppen-Fit & Otto Normalverbraucher**.

Zielgruppe: 25–45 Jahre, kein Finanzwissen, keine Zeit, verdrängt das Thema. Ein guter Freund mit Finanzwissen würde nicht mit Fachbegriffen kommen.

Fragen:
- Welche Fachbegriffe (DRV, bAV, VL, Inflation, Annuität, Kapitalstock etc.) sind unerklärt in der UI?
- Werden Zahlen und Prognosen verständlich kontextualisiert ("Das entspricht 3 Urlauben pro Monat")?
- Ist der emotionale Ton der App einladend oder einschüchternd?
- Würde ein 28-jähriger Softwareentwickler ohne Finanzwissen verstehen, was er tun soll?
- Welche Screens überfordern am meisten?

Code:
${codeContext}
  `, { label: 'analyse:zielgruppe', schema: SCHEMA, effort: 'medium', phase: 'Business-Analyse' }),

  () => agent(`
${STRATEGIE_KONTEXT}

Analysiere die App aus der Perspektive: **Präsentationstag-Readiness & Demo-Risiken**.

Die App wird live vor einem Hochschul-Publikum (Professoren + Kommilitonen) demonstriert. Kein Slideshow-Backup — die App ist das Pitch-Deck.

Fragen:
- Welche Flows können während einer Live-Demo hängen, leere Screens zeigen oder Fehler werfen?
- Gibt es Placeholder-Texte, "TODO", leere States oder Lorem Ipsum in der App?
- Gibt es Screens, die ohne Erklärung verwirrend wirken?
- Wie stark ist der "Wow-Faktor" — was beeindruckt das Publikum am meisten?
- Was sind die 3 riskantesten Demo-Momente?
- Empfehle den optimalen Demo-Flow (welche Screens in welcher Reihenfolge zeigen für maximalen Impact).

Code:
${codeContext}
  `, { label: 'analyse:demo-readiness', schema: SCHEMA, effort: 'medium', phase: 'Business-Analyse' }),

]);

// ─── Phase 3: Synthese & Bericht ─────────────────────────────────────────────

phase('Demo-Synthese')

const analysenText = analysen.filter(Boolean).map(a =>
  `### ${a.dimension} (${a.score}/10)\n**Stärken:** ${a.staerken.join(', ')}\n**Schwächen:** ${a.schwaechen.join(', ')}\n**Empfehlungen:** ${a.empfehlungen.join('; ')}\n**Demo-Risiken:** ${a.demo_risiken.join(', ')}`
).join('\n\n');

const gesamtScore = Math.round(analysen.filter(Boolean).reduce((s, a) => s + a.score, 0) / analysen.filter(Boolean).length * 10) / 10;

const report = await agent(`
${STRATEGIE_KONTEXT}

Du hast 5 unabhängige Analysen von FutureMe erhalten. Erstelle daraus einen prägnanten Präsentations-Report im Markdown-Format.

Analysen:
${analysenText}

Gesamtschnitt: ${gesamtScore}/10

Format des Reports:
---
# FutureMe — Präsentations-Readiness Report

## Gesamtbewertung
[Score] + 1 Satz Urteil

## Das Stärkste an der App
[Top 3 Punkte, die das Publikum beeindrucken werden]

## Kritische Lücken vor dem Präsentationstag
[Top 3–5 Dinge, die JETZT noch geändert werden sollten — priorisiert nach Demo-Impact]

## Unterapp-Story: Ist der Business Case sichtbar?
[Konkretes Urteil: Versteht das Publikum ohne Erklärung, warum TR das baut?]

## Empfohlener Demo-Flow
[Schritt-für-Schritt: welchen Weg durch die App zeigen für maximalen Impact]

## USP-Checkliste
- [ ] KI-Analyse (Rentenbescheid): sichtbar?
- [ ] Kein Fachjargon: erfüllt?
- [ ] TR-Invest-Loop: erkennbar?

## Top 3 Demo-Risiken
[Was kann schiefgehen + Mitigation]

## Jargon-Alarm
[Alle ungeklärten Fachbegriffe, die während der Demo Fragen aufwerfen könnten]
---

Schreibe konkret und handlungsorientiert. Kein Bullshit-Consulting-Sprech.
`, { label: 'report', effort: 'high' });

return report;
