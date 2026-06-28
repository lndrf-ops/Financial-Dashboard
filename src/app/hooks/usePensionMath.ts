/**
 * usePensionMath.ts
 * React hook that drives all financial calculations for the dashboard.
 * Delegates pure math to financeMath.ts; owns the year-by-year simulation.
 */

import { useMemo } from 'react';
import type { Asset } from '../components/custom/AssetBreakdown';
import type { LifeEvent, StressTests } from '../components/custom/SimulateView';
import { monthlyAnnuityPayment, requiredMonthlyPMT } from '../utils/financeMath';

// Conservative payout-phase return (annuity / capital-drawdown rate)
const SAFE_RATE = 0.035;

// Annual state subsidy for the new Altersvorsorgedepot (ab 2027)
const AVD_GRUNDZULAGE_YEARLY = 200;

// ─── Public Interfaces ────────────────────────────────────────────────────────

export interface PensionMathInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyContribution: number;
  dynamicSavings: boolean;
  expectedReturn: number;   // percent, e.g. 7.0
  inflation: number;        // percent, e.g. 2.5
  targetPension: number;    // monthly target in today's €
  dynamicAssets: Asset[];
  vlActive: boolean;
  bavBruttoInvest: number;  // brutto monthly bAV investment
  lifeEvents: LifeEvent[];
  stressTests: StressTests;
  avdActive: boolean;
  avdMonthlyContribution: number;
  avdAccumulated: number;
}

export interface PensionMathResult {
  /** Portfolio value at the start of the retirement phase (post bear-market, post cash-consolidation) */
  capitalAtRetirement: number;
  /** Monthly annuity drawn from the portfolio in nominal € */
  additionalMonthlyPayoutNominal: number;
  /** Total nominal monthly income from all sources at retirement */
  totalNominalMonthly: number;
  /** Inflation deflation factor (real / nominal) = 1/(1+i)^y */
  inflationFactor: number;
  /** Total monthly income expressed in today's purchasing power */
  realPurchasingPowerMonthly: number;
  /** realPurchasingPowerMonthly − targetPension (negative = gap) */
  diff: number;
  isPositive: boolean;
  /** Absolute gap in today's € per month (0 when already positive) */
  currentGap: number;
  /** Suggested extra monthly savings to close ~50 % of gap (rounded to €25) */
  leverSavings: number;
  /** Suggested monthly net bAV salary sacrifice to close ~50 % of gap (rounded to €10) */
  leverBavNetto: number;
  /** Alias for totalNominalMonthly — used by AssetBreakdown */
  combinedMonthlyNominal: number;
  /** Portfolio + real estate accumulated value at retirement */
  totalNetWorthAtRetirement: number;
  /** Years remaining until retirement (clamped to ≥ 0) */
  yearsToRetire: number;
  /** Years in retirement phase */
  yearsInRetirement: number;
  /** Monthly payout from Altersvorsorgedepot at retirement (real €) */
  avdPayoutNominal: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePensionMath({
  currentAge,
  retirementAge,
  lifeExpectancy,
  monthlyContribution,
  dynamicSavings,
  expectedReturn,
  inflation,
  targetPension,
  dynamicAssets,
  vlActive,
  bavBruttoInvest,
  lifeEvents,
  stressTests,
  avdActive,
  avdMonthlyContribution,
  avdAccumulated,
}: PensionMathInput): PensionMathResult {

  // ── Derived configuration ──────────────────────────────────────────────────
  const activeInflation     = stressTests.highInflation ? Math.max(inflation / 100, 0.05) : inflation / 100;
  const activeLifeExp       = stressTests.longevity ? 98 : lifeExpectancy;
  const yearsToRetire       = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement   = Math.max(1, activeLifeExp - retirementAge);

  // Starting capital breakdown
  const etfStart    = dynamicAssets.find(a => a.id === 'etf')?.accumulatedValue    ?? 0;
  const cryptoStart = dynamicAssets.find(a => a.id === 'crypto')?.accumulatedValue ?? 0;
  const cashStart   = dynamicAssets.find(a => a.id === 'cash')?.accumulatedValue   ?? 0;
  const realEstateAcc = dynamicAssets.find(a => a.id === 'realestate')?.accumulatedValue ?? 0;

  const returnMonthly     = (expectedReturn / 100) / 12;
  const safeReturnMonthly = SAFE_RATE / 12;

  // ── Year-by-year wealth simulation ────────────────────────────────────────
  // Returns the two values that everything else derives from.
  const { capitalAtRetirement, additionalMonthlyPayoutNominal, avdCapitalAtRetirement } = useMemo(() => {
    let capInvested = etfStart + cryptoStart;
    let capCash     = cashStart;
    let capAvd      = avdAccumulated;
    let loopSavings = monthlyContribution;
    const agExtra    = (vlActive ? 40 : 0) + bavBruttoInvest;
    const avdMonthly = avdActive ? avdMonthlyContribution : 0;

    // Set once when the retirement phase begins; locked for the entire drawdown
    let retirementCapital    = 0;
    let avdRetirementCapital = 0;
    let annuityLocked        = 0;
    let retirementEntered    = false;

    for (let age = currentAge; age <= activeLifeExp; age++) {
      const event         = lifeEvents.find(e => e.age === age);
      let activeSavings   = loopSavings + agExtra;
      let oneTimeCost     = 0;

      if (event) {
        if (event.type === 'sabbatical') { activeSavings = 0; oneTimeCost = event.cost; }
        else oneTimeCost = event.cost;
      }

      // Absorb one-time costs from cash first, then from invested capital
      if (oneTimeCost > 0) {
        if (capCash >= oneTimeCost) {
          capCash -= oneTimeCost;
        } else {
          capInvested = Math.max(0, capInvested - (oneTimeCost - capCash));
          capCash     = 0;
        }
      }

      if (age < retirementAge) {
        // ── Accumulation phase ──────────────────────────────────────────────
        for (let m = 0; m < 12; m++) {
          capInvested = capInvested * (1 + returnMonthly) + activeSavings;
          if (avdActive) capAvd = capAvd * (1 + returnMonthly) + avdMonthly;
        }
        // State subsidy is paid once per year (not monthly) — add after year-end compounding
        if (avdActive) capAvd += AVD_GRUNDZULAGE_YEARLY;
        if (dynamicSavings && (!event || event.type !== 'sabbatical')) {
          loopSavings *= 1.02; // 2 % annual contribution increase
        }
      } else {
        // ── Drawdown phase ──────────────────────────────────────────────────
        if (!retirementEntered) {
          retirementEntered = true;
          // Consolidate remaining cash into the investment portfolio
          capInvested += capCash;
          capCash      = 0;
          // Apply bear-market crash (−20 % one-time shock at retirement)
          if (stressTests.bearMarket) {
            capInvested *= 0.8;
            capAvd      *= 0.8;
          }
          // Lock in payout level based on actual starting capital
          retirementCapital    = capInvested;
          avdRetirementCapital = capAvd;
          annuityLocked        = monthlyAnnuityPayment(capInvested, SAFE_RATE, yearsInRetirement);
        }
        for (let m = 0; m < 12; m++) {
          capInvested = Math.max(0, capInvested * (1 + safeReturnMonthly) - annuityLocked);
        }
      }
    }

    return {
      capitalAtRetirement: retirementCapital,
      additionalMonthlyPayoutNominal: annuityLocked,
      avdCapitalAtRetirement: avdRetirementCapital,
    };
  }, [
    currentAge, retirementAge, activeLifeExp, monthlyContribution,
    dynamicSavings, returnMonthly, etfStart, cryptoStart, cashStart,
    lifeEvents, stressTests.bearMarket, vlActive, bavBruttoInvest,
    yearsInRetirement, avdActive, avdMonthlyContribution, avdAccumulated,
  ]);

  // ── AVD payout (separate annuity from Altersvorsorgedepot) ───────────────
  const avdPayoutNominal = avdActive && avdCapitalAtRetirement > 0
    ? monthlyAnnuityPayment(avdCapitalAtRetirement, SAFE_RATE, yearsInRetirement)
    : 0;

  // ── Aggregation ───────────────────────────────────────────────────────────
  // Sum all fixed income sources; ETF and AVD payouts are calculated dynamically
  const fixedPayoutsNominal = dynamicAssets
    .filter(a => a.id !== 'etf' && a.id !== 'avd')
    .reduce((s, a) => s + (a.payout ?? 0), 0);

  const totalNominalMonthly = fixedPayoutsNominal + additionalMonthlyPayoutNominal + avdPayoutNominal;

  // ── Inflation adjustment ─────────────────────────────────────────────────
  // Fisher discounting: PV = FV / (1+i)^y (textbook-correct formula)
  const inflationFactor             = yearsToRetire === 0 ? 1 : 1 / Math.pow(1 + activeInflation, yearsToRetire);
  const realPurchasingPowerMonthly  = Math.round(totalNominalMonthly * inflationFactor);

  // ── Gap ───────────────────────────────────────────────────────────────────
  const diff       = realPurchasingPowerMonthly - targetPension;
  const isPositive = diff >= 0;
  const currentGap = isPositive ? 0 : Math.abs(diff);

  // ── Lever calculations (PMT-based) ────────────────────────────────────────
  // Replace the old linear heuristic with the correct PMT formula.
  // requiredMonthlyPMT returns the monthly savings needed to close the FULL gap
  // via portfolio growth alone. We allocate 50 % to private savings and 50 % to bAV.
  const fullPMT = requiredMonthlyPMT(
    currentGap,
    expectedReturn / 100,
    activeInflation,
    yearsToRetire,
    yearsInRetirement,
    SAFE_RATE,
  );

  // Private savings lever — rounded to nearest €25 for clean UX
  const leverSavings = currentGap === 0 ? 0
    : Math.max(25, Math.round(fullPMT * 0.5 / 25) * 25);

  // bAV lever — netto salary sacrifice: each € netto unlocks ~2.1 € brutto
  // (combined income-tax + social-contribution savings for a median earner)
  const leverBavNetto = currentGap === 0 ? 0
    : Math.min(250, Math.max(10, Math.round(fullPMT * 0.5 / 2.1 / 10) * 10));

  // ── Output ────────────────────────────────────────────────────────────────
  return {
    capitalAtRetirement,
    additionalMonthlyPayoutNominal,
    totalNominalMonthly,
    inflationFactor,
    realPurchasingPowerMonthly,
    diff,
    isPositive,
    currentGap,
    leverSavings,
    leverBavNetto,
    combinedMonthlyNominal: totalNominalMonthly,
    totalNetWorthAtRetirement: capitalAtRetirement + avdCapitalAtRetirement + realEstateAcc,
    yearsToRetire,
    yearsInRetirement,
    avdPayoutNominal,
  };
}
