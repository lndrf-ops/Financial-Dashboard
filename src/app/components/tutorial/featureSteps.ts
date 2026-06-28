export interface FeatureStep {
  title: string;
  text: string;
  targetId: string;
  panelPosition?: 'top' | 'bottom';
}

export const FEATURE_STEPS: Record<string, FeatureStep[]> = {
  dashboard: [
    { title: "Rentenring", text: "Tippe auf ein Segment um deine Rentenquelle zu sehen — der Ring zeigt deinen Deckungsgrad auf einen Blick.", targetId: "tutorial-dashboard-ring" },
    { title: "Deckungsgrad", text: "100 % bedeutet: dein Wunscheinkommen im Alter ist gesichert. Diese Zahl ist dein wichtigstes Ziel.", targetId: "tutorial-dashboard-badge" },
    { title: "Deine 3 Hebel", text: "FutureMe berechnet die 3 wirkungsvollsten Maßnahmen gegen deine Lücke — sortiert nach Einfluss.", targetId: "tutorial-dashboard-hebel" },
    { title: "Rentenbausteine", text: "Tippe auf einen Baustein um Werte anzupassen — z.B. gesetzliche Rente oder ETF-Depotwert.", targetId: "tutorial-dashboard-assets" },
    { title: "Lücke schließen", text: "Tippe hier um alle Maßnahmen auf einmal zu aktivieren — FutureMe optimiert deinen Sparweg automatisch.", targetId: "tutorial-dashboard-cta" },
  ],
  invest: [
    { title: "Monatlicher Sparplan", text: "Dieser Betrag wird jeden Monat automatisch über dein Trade Republic Depot investiert.", targetId: "tutorial-invest-savings" },
    { title: "10-Jahres-Vorschau", text: "Der Chart zeigt deine Vermögensentwicklung bei gleichbleibender Sparrate und deiner eingestellten Renditeerwartung.", targetId: "tutorial-invest-chart" },
    { title: "Deine Ausführung", text: "Dein Kapital wird auf MSCI World ETF und optional Bitcoin aufgeteilt — mit einem Klick im TR-Depot ausführbar.", targetId: "tutorial-invest-execution" },
  ],
  simulate: [
    { title: "Stresstests", text: "Teste dein Portfolio gegen Extremszenarien: Börsencrash, hohe Inflation oder überdurchschnittliche Lebenserwartung.", targetId: "tutorial-simulate-stresstests" },
    { title: "Altersvorsorgedepot 2027", text: "Ab Januar 2027 ersetzt das staatlich geförderte Depot die Riester-Rente — mit bis zu 200 € Zulage pro Jahr. Hier siehst du schon jetzt die Auswirkung.", targetId: "tutorial-simulate-avd" },
    { title: "Lebensereignisse", text: "Füge Elternzeit, Hauskauf oder Sabbatical hinzu — sieh sofort wie sich das auf dein Rentenkonto auswirkt.", targetId: "tutorial-simulate-events" },
  ],
  profile: [
    { title: "Dein Account", text: "Passe persönliche Daten, Steuerklasse und Risikoprofil an — alles aus deinem Trade Republic Konto übernommen.", targetId: "tutorial-profile-account" },
    { title: "Daten-Sync", text: "Lade deinen Rentenbescheid hoch oder gleiche Werte mit der Deutschen Rentenversicherung ab.", targetId: "tutorial-profile-datasync" },
    { title: "Simulations-Parameter", text: "Renteneintrittsalter, Sparrate und Renditeerwartung anpassen — alle Berechnungen aktualisieren sich live.", targetId: "tutorial-profile-simparams" },
  ],
  chat: [
    { title: "Finn – KI-Assistent", text: "Finn kennt deine Rentendaten und aktiviert Szenarien direkt für dich. Kein Menü — einfach fragen.", targetId: "tutorial-chat-header" },
    { title: "Smarte Vorschläge", text: "Tippe auf einen Chip und Finn antwortet sofort — und passt deine Simulation live an.", targetId: "tutorial-chat-chips", panelPosition: 'top' },
    { title: "Eigene Fragen", text: "Schreib direkt: z.B. 'Was passiert bei Inflation?' oder 'Erhöhe meine Sparrate'. Finn versteht natürliche Sprache.", targetId: "tutorial-chat-input", panelPosition: 'top' },
  ],
};
