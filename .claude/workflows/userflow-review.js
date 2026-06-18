export const meta = {
  name: 'userflow-review',
  description: 'Bewertet den kompletten Userflow der FutureMe App (Onboarding → Dashboard → Features)',
  whenToUse: 'Nach UI/UX-Anpassungen ausführen um den Userflow zu bewerten',
  phases: [
    { title: 'Lesen', detail: 'Alle relevanten Komponenten einlesen' },
    { title: 'Analyse', detail: 'Jeden Flow-Abschnitt unabhängig bewerten' },
    { title: 'Synthese', detail: 'Gesamtbewertung und priorisierte Empfehlungen' },
  ],
};

// ─── Kontext ──────────────────────────────────────────────────────────────────
// FutureMe hat einen klaren Auftrag: das "unsexy" Thema Rente für den deutschen
// Otto Normalverbraucher zugänglich machen. Die Zielgruppe sind 25–45-Jährige
// ohne Finanzvorbildung — Menschen, die das Thema verdrängen, sich davon
// überfordert fühlen oder schlicht keine Zeit haben, sich damit auseinanderzusetzen.
// Die App soll emotional einladen statt abschrecken, Klarheit statt Fachjargon
// liefern und den Nutzer in kleinen, sicheren Schritten befähigen zu handeln.
// Referenz: Wie würde ein guter Freund mit Finanzwissen das Thema erklären?
// ─────────────────────────────────────────────────────────────────────────────

// ─── Phase 1: Relevante Dateien einlesen ─────────────────────────────────────

phase('Lesen')

const files = await parallel([
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/App.tsx', { label: 'read:App.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/AIOnboarding.tsx', { label: 'read:AIOnboarding.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/Onboarding.tsx', { label: 'read:Onboarding.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/InvestView.tsx', { label: 'read:InvestView.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/SimulateView.tsx', { label: 'read:SimulateView.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/ProfileView.tsx', { label: 'read:ProfileView.tsx', effort: 'low' }),
  () => agent('Lies diese Dateien vollständig und gib ihren kompletten Inhalt zurück (kein Kürzen): src/app/components/custom/OptimizationPlan.tsx', { label: 'read:OptimizationPlan.tsx', effort: 'low' }),
])

const [appCode, aiOnboardingCode, onboardingCode, investCode, simulateCode, profileCode, optimizeCode] = files

// ─── Phase 2: Parallele Analyse aller Flow-Abschnitte ────────────────────────

phase('Analyse')

const KONTEXT = `
KERNAUFTRAG DER APP:
FutureMe macht das "unsexy" Thema Altersvorsorge für den deutschen Otto Normalverbraucher zugänglich.
Zielgruppe: 25–45-Jährige ohne Finanzvorwissen, die das Thema verdrängen oder sich überfordert fühlen.
Leitfrage bei jeder Bewertung: Würde meine nicht-finanzaffine Freundin (28, Lehrerin, kein Brokerkonto)
diesen Schritt verstehen, sich wohl fühlen und weitermachen wollen — oder abspringen?

BEWERTUNGSLINSE "Otto Normalverbraucher":
- Jargon-Test: Begriffe wie "bAV", "DRV", "Entgeltumwandlung", "Anrechnungszeiten" — verständlich erklärt oder nackt stehen gelassen?
- Angst-Test: Macht der Screen Angst ("Du hast eine Lücke von €X") oder Mut ("Du kannst das schließen")?
- Komplexitäts-Test: Wie viele Entscheidungen muss der Nutzer auf diesem Screen treffen?
- Vertrauen-Test: Fühlt sich das seriös & sicher an (kein Spam-Feeling, kein Paywall-Druck)?
- Fortschritts-Test: Weiß der Nutzer immer, wo er ist und was als Nächstes kommt?
`

const FLOW_SCHEMA = {
  type: 'object',
  properties: {
    section: { type: 'string' },
    score: { type: 'number', description: '1–10' },
    normalverbraucher_score: { type: 'number', description: 'Separater Score: Wie gut funktioniert das für jemanden ohne Finanzwissen? 1–10' },
    strengths: { type: 'array', items: { type: 'string' } },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['kritisch', 'mittel', 'klein'] },
          description: { type: 'string' },
          suggestion: { type: 'string' },
          normalverbraucher_impact: { type: 'string', description: 'Konkret: Wie wirkt dieses Problem auf die Zielgruppe?' },
        },
        required: ['severity', 'description', 'suggestion', 'normalverbraucher_impact'],
      },
    },
    jargon_found: { type: 'array', items: { type: 'string' }, description: 'Liste aller Fachbegriffe ohne ausreichende Erklärung' },
    ux_notes: { type: 'string' },
  },
  required: ['section', 'score', 'normalverbraucher_score', 'strengths', 'issues', 'jargon_found', 'ux_notes'],
}

const analyses = await parallel([

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte den **Welcome Screen & Einstieg** der FutureMe App.

App-Code (App.tsx, welcome-Bereich):
${appCode}

Bewertungskriterien:
- Schafft der erste Screen emotionale Einladung statt Angst vor dem Thema Rente?
- Ist das Value Proposition in einem Satz verständlich (auch für jemanden ohne Finanzwissen)?
- CTA-Hierarchie: Ist "Jetzt starten" mutig genug? Wirkt "Beispielprofile ansehen" einladend oder wie eine Ausweichoption?
- Vertrauen & Branding (Trade Republic Kontext, kein Spam-Feeling)
- Wie fühlt sich die App in den ersten 3 Sekunden an?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:welcome', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte den **AI-Onboarding Flow** (7 Schritte) der FutureMe App.

AIOnboarding-Code:
${aiOnboardingCode}

Bewertungskriterien:
- Jargon-Check: Welche Begriffe stehen nackt (DRV, bAV, Anrechnungszeiten, Entgeltumwandlung)?
- Schritt 2 (Gefühlsabfrage): Schafft das emotionale Sicherheit oder wirkt es gimmicky?
- Schritt 3 (Dropzone): Versteht die Zielgruppe, was "Vorsorgepapiere" sind und wo sie die finden?
- Schritt 4 (Arbeitgeber): Sind die drei Optionen für Nicht-Finanzprofis trennscharf?
- Schritt 5 (Versteckte Rentenpunkte): "Free Money" — motivierend oder unseriös für die Zielgruppe?
- Progressbar & Schrittanzahl: Fühlen sich 7 Schritte zumutbar an oder kapituliert man vorher?
- Ladescreen am Ende: Erzeugt er Vorfreude oder Ungeduld?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:ai-onboarding', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte den **Persona-Onboarding Flow** (Beispielprofile) der FutureMe App.

Onboarding-Code:
${onboardingCode}

Bewertungskriterien:
- Versteht die Zielgruppe sofort, was "Beispielprofile" sind und warum das für sie relevant ist?
- Identifikationspotenzial der Personas: Findet sich ein 28-jähriger Bürokaufmann darin wieder?
- Zahlen auf den Karten: Reichen die Infos, damit man eine Wahl trifft?
- Sprache & Ton: Einladend oder distanziert-fachlich?
- Wie schnell kommt man ins Dashboard?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:persona-onboarding', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte das **Dashboard & Tutorial** der FutureMe App.

App-Code (Dashboard-Bereich + TutorialOverlay):
${appCode}

Bewertungskriterien:
- Tutorial-Texte: Sind die 4 Schritte in alltagsnaher Sprache (kein "Zinseszins", kein "Kaufkraft")? Machen sie Lust auf die App?
- Ringchart: Versteht jemand ohne Finanzwissen sofort, was die Zahl in der Mitte bedeutet?
- Segment-Labels: Sind die Begriffe (Gesetzl. Rente, Portfolio, bAV) verständlich ohne Erklärung?
- Hebel-Karten: Ist klar, was VL und bAV sind — oder wirkt es wie Fachjargon?
- "Lücke schließen"-CTA: Motiviert oder macht der Begriff "Lücke" Angst?
- Neue Logout-Confirmation: Sprache und Ton — passt das zur Zielgruppe?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:dashboard', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte die **Investieren-Ansicht** der FutureMe App.

InvestView-Code:
${investCode}

Bewertungskriterien:
- Versteht die Zielgruppe, warum sie diese Ansicht braucht (Was ist der Job-to-be-done)?
- Zinseszins-Visualisierung: Macht der Chart den "Aha-Moment" spürbar oder bleibt er abstrakt?
- Begriffe wie "MSCI World", "Portfolio", "p.a.": Erklärt oder erschlagend?
- Fehlender Sparraten-Slider: Was verliert die Zielgruppe dadurch konkret?
- Verbindung zum persönlichen Rentenziel: Ist klar, wie dieses Sparen die Rentenlücke schließt?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:invest', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte die **Simulations-Ansicht** der FutureMe App.

SimulateView-Code:
${simulateCode}

Bewertungskriterien:
- "Bärenmarkt", "Longevity-Risiko", "Hohe Inflation": Versteht die Zielgruppe diese Begriffe ohne Erklärung?
- Lebensereignisse: Sind die vorgeschlagenen Events (Elternzeit, Immobilie, Sabbatical) für die Zielgruppe lebensnah?
- Fehlendes Feedback nach Stresstest-Aktivierung: Wie frustierend ist das für einen Nicht-Finanzprofi?
- Macht das Simulieren Spaß oder fühlt es sich an wie eine Steuererklärung?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:simulate', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte den **Optimierungsplan** der FutureMe App.

OptimizationPlan-Code:
${optimizeCode}

Bewertungskriterien:
- "bAV", "VL", "Entgeltumwandlung", "Brutto-Netto-Effekt": Werden diese Begriffe ausreichend erklärt?
- Gap-Relativierung ("3 Kaffees to-go"): Trifft das die Zielgruppe emotional oder wirkt es herablassend?
- Konkrete nächste Schritte: Weiß die Zielgruppe nach dem Flow, was sie morgen tun soll?
- Vertrauen: Fühlt sich das Abschicken eines bAV-Antrags an wie ein echter Schritt oder wie eine Demo?
- Abschlussgefühl: Geht man motiviert raus oder erschöpft?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:optimize', schema: FLOW_SCHEMA }),

  () => agent(`Du bist UX-Experte für Mobile Finance Apps. Dein Bewertungsmaßstab ist der "Otto Normalverbraucher" — jemand ohne Finanzvorwissen, der das Thema Rente verdrängt.
${KONTEXT}

Bewerte die **Navigation & übergreifende UX** der FutureMe App.

App-Code (Bottom Nav, View-Wechsel, Modals):
${appCode}

Bewertungskriterien:
- Bottom Nav mit Icons: Sind "Übersicht", "Investieren", "Simulation", "Profil" als Tab-Labels für die Zielgruppe selbsterklärend?
- Neue Logout-Confirmation: Schafft das Dialog-Muster Sicherheit oder erzeugt es Angst ("Daten gehen verloren")?
- Gibt es Dead Ends wo jemand ohne Finanzvorwissen nicht weiterkommt?
- Konsistenz der Sprache über alle Views: Immer gleicher Ton?
- Mobile-Feeling: Fühlt sich die App wie eine echte App an (Touch-Targets, kein Overflow)?

Gib eine strukturierte Bewertung zurück.`, { label: 'analyse:navigation', schema: FLOW_SCHEMA }),

])

// ─── Phase 3: Synthese ───────────────────────────────────────────────────────

phase('Synthese')

const validAnalyses = analyses.filter(Boolean)

const SYNTHESIS_SCHEMA = {
  type: 'object',
  properties: {
    overall_score: { type: 'number' },
    normalverbraucher_score: { type: 'number', description: 'Durchschnitt der Normalverbraucher-Scores' },
    summary: { type: 'string' },
    top_strengths: { type: 'array', items: { type: 'string' }, maxItems: 5 },
    critical_issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          priority: { type: 'number' },
          section: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
          normalverbraucher_impact: { type: 'string' },
        },
        required: ['priority', 'section', 'issue', 'fix', 'normalverbraucher_impact'],
      },
    },
    jargon_summary: { type: 'array', items: { type: 'string' }, description: 'Alle ungeklärten Fachbegriffe aus allen Analysen zusammengeführt und priorisiert' },
    quick_wins: { type: 'array', items: { type: 'string' }, maxItems: 5 },
    section_scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string' },
          score: { type: 'number' },
          normalverbraucher_score: { type: 'number' },
        },
        required: ['section', 'score', 'normalverbraucher_score'],
      },
    },
  },
  required: ['overall_score', 'normalverbraucher_score', 'summary', 'top_strengths', 'critical_issues', 'jargon_summary', 'quick_wins', 'section_scores'],
}

const synthesis = await agent(`Du bist Lead UX-Stratege für FutureMe — eine Mobile Finance App, die das Thema Rente für den deutschen Otto Normalverbraucher zugänglich machen soll.

Hier sind die Einzelbewertungen aller App-Bereiche:

${validAnalyses.map(a => `
## ${a.section} — Score: ${a.score}/10 | Normalverbraucher: ${a.normalverbraucher_score}/10
Stärken: ${a.strengths.join(', ')}
Jargon ohne Erklärung: ${(a.jargon_found || []).join(', ') || 'keiner gefunden'}
Issues: ${a.issues.map(i => `[${i.severity}] ${i.description} → Zielgruppen-Impact: ${i.normalverbraucher_impact}`).join(' | ')}
UX Notes: ${a.ux_notes}
`).join('\n')}

Deine Aufgabe:
1. Gesamtscore (gewichtet, Onboarding & Dashboard höchstes Gewicht) + separater Normalverbraucher-Score
2. Top-5-Stärken der App
3. Priorisierte kritische Issues — immer mit konkretem Zielgruppen-Impact
4. Jargon-Zusammenfassung: Welche Begriffe müssen als erstes erklärt werden?
5. 5 Quick Wins (kleiner Aufwand, großer Impact für die Zielgruppe)
6. Executive Summary auf Deutsch (3–5 Sätze)

Gib das strukturierte Ergebnis zurück.`, { label: 'synthese:gesamt', schema: SYNTHESIS_SCHEMA })

// ─── Markdown Report generieren ──────────────────────────────────────────────

const report = await agent(`Erstelle einen vollständigen Markdown-Report aus diesen Daten.

SYNTHESE:
${JSON.stringify(synthesis, null, 2)}

EINZELANALYSEN:
${JSON.stringify(validAnalyses, null, 2)}

Format des Reports:
\`\`\`
# FutureMe — Userflow-Bewertung

## Gesamtbewertung: X.X / 10 | Normalverbraucher: X.X / 10

> [Executive Summary]

---

## Score-Übersicht
| Bereich | Score | Normalverbraucher |
|---------|-------|-------------------|
| ...     | X/10  | X/10              |

## 🗣️ Jargon-Alarm — Diese Begriffe müssen erklärt werden
(priorisierte Liste der ungeklärten Fachbegriffe mit konkretem Vorschlag)

## Top-Stärken
1. ...

## Kritische Issues (Priorisiert)
### 🔴 Kritisch
(immer mit Zielgruppen-Impact)
### 🟡 Mittel

## Quick Wins
1. ...

## Detailanalysen
### Welcome Screen
...
(für jeden Bereich mit Normalverbraucher-Perspektive)
\`\`\`

Schreib den Report auf Deutsch. Nutze Emojis sparsam aber sinnvoll. Sei konkret und handlungsorientiert.
Stelle den Normalverbraucher-Score und den Jargon-Alarm prominent heraus — das ist der Kernfokus.`,
{ label: 'report:markdown' })

return report
