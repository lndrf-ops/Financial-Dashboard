import { Asset } from '../components/custom/AssetBreakdown';

export interface AuditIssue {
  id: string;
  severity: 'error' | 'warn' | 'info';
  title: string;
  detail: string;
  fix: string;
}

export interface AuditInput {
  vlActive: boolean;
  leverBavNetto: number;
  leverSavings: number;
  currentGap: number;
  isPositive: boolean;
  dynamicAssets: Asset[];
  avdActive: boolean;
  monthlyContribution: number;
  currentAge: number;
  retirementAge: number;
}

export function runBusinessLogicAudit(state: AuditInput): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const {
    vlActive, leverBavNetto, leverSavings, currentGap,
    isPositive, dynamicAssets, avdActive,
    monthlyContribution, currentAge, retirementAge,
  } = state;

  const vlGain = currentGap === 0 ? 0 : Math.min(40, currentGap);

  // ── Lever-Checks ──────────────────────────────────────────────────────────

  // bAV-Hebel ohne Arbeitgeber: vlActive=false bedeutet kein Angestelltenverhältnis.
  // Selbstständige und Beamte (VBL läuft automatisch) können keine eigene bAV abschließen.
  if (!vlActive && leverBavNetto > 0 && !isPositive) {
    issues.push({
      id: 'bav_lever_no_employer',
      severity: 'error',
      title: 'bAV-Hebel ohne Arbeitgeber sichtbar',
      detail: `leverBavNetto = ${leverBavNetto} € wird empfohlen, aber vlActive = false — kein Arbeitgeber verfügbar. Selbstständige und Beamte können keine bAV abschließen.`,
      fix: 'LeverCards.tsx: bAV-Hebel mit `hidden: !vlActive` ausblenden.',
    });
  }

  // VL-Hebel ohne Arbeitgeber
  if (!vlActive && vlGain > 0) {
    issues.push({
      id: 'vl_lever_no_employer',
      severity: 'error',
      title: 'VL-Hebel ohne Arbeitgeber sichtbar',
      detail: `VL-Hebel zeigt +${vlGain} €/mtl., aber vlActive = false — kein Arbeitgeber, der VL zahlen kann (Selbstständig/Beamtenverhältnis).`,
      fix: 'LeverCards.tsx: VL-Hebel mit `hidden: !vlActive || vlGain === 0` ausblenden.',
    });
  }

  // leverBavNetto übertrifft die Lücke deutlich
  if (leverBavNetto > 0 && currentGap > 0 && leverBavNetto * 2.1 > currentGap * 1.5) {
    issues.push({
      id: 'bav_lever_overshoots_gap',
      severity: 'warn',
      title: 'bAV-Bruttobeitrag übertrifft Lücke erheblich',
      detail: `leverBavNetto = ${leverBavNetto} € netto → ~${Math.round(leverBavNetto * 2.1)} € Brutto-Sparleistung. currentGap = ${currentGap} €. Empfehlung liegt weit über dem Notwendigen.`,
      fix: 'usePensionMath.ts: leverBavNetto-Ergebnis auf Math.min(leverBavNetto, Math.ceil(currentGap / 2.1 / 10) * 10) begrenzen.',
    });
  }

  // leverSavings unrealistisch hoch relativ zur aktuellen Sparrate
  if (leverSavings > 0 && monthlyContribution > 0 && leverSavings > monthlyContribution * 2) {
    issues.push({
      id: 'lever_savings_high_ratio',
      severity: 'warn',
      title: 'Sparraten-Hebel > 2× aktuelle Sparrate',
      detail: `leverSavings = ${leverSavings} €/mtl., monthlyContribution = ${monthlyContribution} €/mtl. Verdoppelung der Sparrate als Empfehlung ist möglicherweise unrealistisch.`,
      fix: 'usePensionMath.ts: leverSavings auf Math.min(leverSavings, monthlyContribution * 2) oder eine erreichbare absolute Obergrenze begrenzen.',
    });
  }

  // ── Asset-Checks ──────────────────────────────────────────────────────────

  const statutory = dynamicAssets.find(a => a.id === 'statutory');
  const company   = dynamicAssets.find(a => a.id === 'company');

  // Gesetzliche Rente = 0 für Nutzer ≥ 30 Jahre: wahrscheinlich fehlt DRV-Scan.
  if (statutory && statutory.payout === 0 && currentAge >= 30) {
    issues.push({
      id: 'statutory_zero_adult',
      severity: 'warn',
      title: 'Gesetzliche Rente = 0 bei Alter ≥ 30',
      detail: `statutory.payout = 0, currentAge = ${currentAge}. Ein ${currentAge}-Jähriger hat typischerweise bereits Rentenansprüche aus Beitragszeiten.`,
      fix: 'DashboardView: Hinweis einblenden "Lade deinen DRV-Bescheid hoch für genaue Werte." wenn statutory.payout === 0.',
    });
  }

  // bAV-Hebel zeigt hohen Wert, obwohl company-Asset bereits aktiv ist
  if (vlActive && company && company.payout > 0 && leverBavNetto > 150) {
    issues.push({
      id: 'bav_lever_while_company_active',
      severity: 'info',
      title: 'Hoher bAV-Hebel trotz aktiver Betriebsrente',
      detail: `company.payout = ${company.payout} €/mtl. (bAV bereits aktiv), trotzdem leverBavNetto = ${leverBavNetto} €. Ist die bAV wirklich noch weiter ausbaubar oder überlappen sich Empfehlung und Bestand?`,
      fix: 'usePensionMath.ts: leverBavNetto reduzieren wenn company.payout > 0 (bestehende bAV anrechnen).',
    });
  }

  // ── Zeitraum-Checks ───────────────────────────────────────────────────────

  // Renteneintrittsalter zu nah an aktuellem Alter
  if (retirementAge - currentAge < 5 && !isPositive) {
    issues.push({
      id: 'retirement_imminent_gap',
      severity: 'warn',
      title: 'Rentenlücke bei weniger als 5 Jahren bis Rente',
      detail: `retirementAge - currentAge = ${retirementAge - currentAge} Jahre. Hebel wie "Sparrate erhöhen" haben kaum noch Wirkung — die Empfehlungen könnten irreführend sein.`,
      fix: 'LeverCards/DashboardView: Bei yearsToRetire < 5 andere Empfehlungen anzeigen (z.B. Einmalbeiträge, Rentenalter anpassen).',
    });
  }

  // ── AVD-Checks ────────────────────────────────────────────────────────────

  // avdActive vor 2027: nur als Simulation erlaubt, sollte nicht als reale Aktion behandelt werden
  if (avdActive && new Date() < new Date('2027-01-01')) {
    issues.push({
      id: 'avd_simulation_mode',
      severity: 'info',
      title: 'AVD aktiv im Simulationsmodus (vor 2027)',
      detail: 'avdActive = true, aber aktuelles Datum < 2027-01-01. Bewusst als Vorschau erlaubt — AVD-Toggle sollte disabled=true sein um versehentliche Aktivierung zu verhindern.',
      fix: 'SimulateView.tsx: Switch disabled={!AVD_AVAILABLE} — bereits implementiert. Sicherstellen, dass avdActive=true nicht als echte Aktivierung behandelt wird.',
    });
  }

  return issues;
}
