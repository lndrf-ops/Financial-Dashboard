export interface FeatureStep {
  title: string;
  text: string;
  targetId: string;
}

export const FEATURE_STEPS: Record<string, FeatureStep[]> = {
  dashboard: [
    { title: "Dein Rentenring", text: "Der Ring zeigt deinen Rentendeckungsgrad auf einen Blick. Jedes Segment steht für eine Rentenquelle — tippe drauf um Details zu sehen.", targetId: "tutorial-dashboard-ring" },
    { title: "Dein Deckungsgrad", text: "Diese Zahl zeigt, wie viel Prozent deines Rentenziels du bereits abdeckst. 100% bedeutet: dein Wunscheinkommen im Alter ist vollständig gesichert.", targetId: "tutorial-dashboard-badge" },
    { title: "Deine 3 größten Hebel", text: "FutureMe berechnet automatisch die 3 effektivsten Maßnahmen zur Schließung deiner Lücke — sortiert nach Wirkung.", targetId: "tutorial-dashboard-hebel" },
    { title: "Deine Rentenbausteine", text: "Tippe auf einen Baustein um Werte direkt anzupassen — z.B. deine gesetzliche Rente oder den ETF-Depotwert.", targetId: "tutorial-dashboard-assets" },
  ],
  invest: [
    { title: "Dein monatlicher Sparplan", text: "Der Betrag, der jeden Monat automatisch über dein Trade Republic Depot investiert wird — direkt aus dem Onboarding übernommen.", targetId: "tutorial-invest-savings" },
    { title: "10-Jahres-Vorschau", text: "Der Chart zeigt die Vermögensentwicklung der nächsten 10 Jahre bei gleichbleibender Sparrate und 7% Rendite pro Jahr.", targetId: "tutorial-invest-chart" },
    { title: "Deine Ausführung", text: "Dein Kapital wird auf MSCI World ETF und optional Bitcoin aufgeteilt — mit einem Klick direkt in deinem TR-Depot ausführbar.", targetId: "tutorial-invest-execution" },
  ],
  simulate: [
    { title: "Stresstests", text: "Teste dein Portfolio gegen reale Extremszenarien: Börsencrash, hohe Inflation oder überdurchschnittliche Lebenserwartung.", targetId: "tutorial-simulate-stresstests" },
    { title: "Lebensereignisse", text: "Simuliere echte Momente: Elternzeit, Hauskauf, Jobwechsel oder Gehaltssprünge. Sieh sofort die Auswirkung auf dein Rentenkonto.", targetId: "tutorial-simulate-events" },
    { title: "Live-Auswirkung", text: "Alle Szenarien werden sofort auf deinen Rentenring angerechnet — wechsel zur Übersicht um das Ergebnis zu sehen.", targetId: "tutorial-simulate-events" },
  ],
  profile: [
    { title: "Dein Account", text: "Passe deine persönlichen Daten, Steuerklasse und Risikoprofil an — alles wird direkt aus deinem Trade Republic Konto übernommen.", targetId: "tutorial-profile-account" },
    { title: "Daten-Sync", text: "Lade deinen Rentenbescheid hoch oder gleiche Werte mit der Deutschen Rentenversicherung ab — für eine präzise Netto-Berechnung.", targetId: "tutorial-profile-datasync" },
    { title: "Simulations-Parameter", text: "Passe Renteneintrittsalter, monatliche Sparrate und Renditeerwartung an. Alle Berechnungen aktualisieren sich in Echtzeit.", targetId: "tutorial-profile-simparams" },
  ],
  chat: [
    { title: "Finn – dein KI-Assistent", text: "Finn kennt all deine Rentendaten und kann Szenarien direkt für dich aktivieren. Kein Menü, kein Suchen — einfach fragen.", targetId: "tutorial-chat-header" },
    { title: "Smarte Vorschläge", text: "Finn schlägt dir die wirkungsvollsten Aktionen vor. Tipp auf einen Chip und er antwortet sofort — und passt deine Simulation live an.", targetId: "tutorial-chat-chips" },
    { title: "Eigene Fragen stellen", text: "Schreib Finn direkt: z.B. 'Was passiert bei Inflation?' oder 'Erhöhe meine Sparrate'. Er versteht natürliche Sprache.", targetId: "tutorial-chat-input" },
  ],
};
