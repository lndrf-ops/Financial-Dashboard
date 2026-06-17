/**
 * financeMath.ts
 * Pure financial mathematics — no React, no side effects.
 * All rate parameters are fractional per annum (e.g. 0.07 = 7 % p.a.).
 */

const mr = (annualRate: number) => annualRate / 12;

// ─── Compound Growth ─────────────────────────────────────────────────────────

/**
 * Future value of a lump sum plus regular monthly contributions.
 *   FV = PV·(1+r)^n + PMT·((1+r)^n − 1)/r
 *
 * @param startCapital       Existing capital today (€)
 * @param monthlyContribution Monthly savings added at end of each period (€)
 * @param annualReturnRate   Nominal annual return (e.g. 0.07)
 * @param years              Accumulation period in years
 */
export function futureValue(
  startCapital: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number,
): number {
  if (years <= 0) return Math.max(0, startCapital);
  const n = Math.round(years * 12);
  const r = mr(annualReturnRate);
  if (r === 0) return Math.max(0, startCapital + monthlyContribution * n);
  const fvf = Math.pow(1 + r, n);
  return Math.max(0, startCapital * fvf + monthlyContribution * (fvf - 1) / r);
}

// ─── Annuity / Drawdown ───────────────────────────────────────────────────────

/**
 * Monthly payment that draws a capital pool down to zero over `years`.
 *   PMT = C·r / (1 − (1+r)^−n)   — standard capital-drawdown annuity
 *
 * @param capital          Starting pool (€)
 * @param annualReturnRate Conservative annual return during payout phase
 * @param years            Duration of payout phase in years
 */
export function monthlyAnnuityPayment(
  capital: number,
  annualReturnRate: number,
  years: number,
): number {
  if (capital <= 0 || years <= 0) return 0;
  const n = Math.round(years * 12);
  const r = mr(annualReturnRate);
  if (r === 0) return capital / n;
  return capital * r / (1 - Math.pow(1 + r, -n));
}

/**
 * Capital required today to pay out `monthlyPayout` for `years` — inverse of
 * monthlyAnnuityPayment.
 *   PV = PMT·(1 − (1+r)^−n) / r
 */
export function capitalNeededForPayout(
  monthlyPayout: number,
  annualReturnRate: number,
  years: number,
): number {
  if (monthlyPayout <= 0 || years <= 0) return 0;
  const n = Math.round(years * 12);
  const r = mr(annualReturnRate);
  if (r === 0) return monthlyPayout * n;
  return monthlyPayout * (1 - Math.pow(1 + r, -n)) / r;
}

// ─── Inflation ────────────────────────────────────────────────────────────────

/**
 * Deflate a future nominal amount to today's purchasing power.
 *   PV = FV / (1+i)^years   (Fisher discounting — textbook correct)
 *
 * Note: the codebase previously used (1−i)^y which slightly overestimates
 * the inflation drag. This function uses the correct compound formula.
 */
export function inflationDeflate(
  nominalValue: number,
  annualInflationRate: number,
  years: number,
): number {
  if (years <= 0) return nominalValue;
  return nominalValue / Math.pow(1 + annualInflationRate, years);
}

// ─── Heuristics ───────────────────────────────────────────────────────────────

/**
 * Estimate gross statutory DRV pension from current net income.
 * Approximation: ~45 % of net income (DRV targets ~48 % gross wage replacement;
 * for a median earner net is roughly 5–10 % less than gross replacement).
 */
export function estimateStatutoryPension(currentNetIncome: number): number {
  return Math.round(Math.max(0, currentNetIncome) * 0.45);
}

// ─── Lever / Reverse-Engineering ─────────────────────────────────────────────

/**
 * Required ADDITIONAL monthly savings (PMT, in today's €) to close a pension gap
 * exclusively via portfolio growth.
 *
 * Algorithm:
 *  1. How much capital is needed at retirement (real, today's €) to fund
 *     `monthlyGapReal` for the full retirement period?
 *       C_real = PV_annuity(monthlyGapReal, safeRate, yearsInRetirement)
 *
 *  2. Convert that real capital requirement to a nominal target at retirement.
 *     Inflation erodes purchasing power, so we need more nominal € to buy the
 *     same real amount:
 *       C_nominal = C_real · (1+i)^yearsToRetirement
 *
 *  3. Compute the monthly PMT to accumulate C_nominal at the nominal return:
 *       PMT = C_nominal · r / ((1+r)^n − 1)
 *
 * @param monthlyGapReal      Pension gap in today's purchasing power (€/month)
 * @param nominalReturnRate   Portfolio nominal return p.a. (e.g. 0.07)
 * @param inflationRate       Annual inflation (e.g. 0.025)
 * @param yearsToRetirement   Remaining years until retirement
 * @param yearsInRetirement   Expected retirement duration in years
 * @param safeWithdrawalRate  Conservative payout-phase return (default 3.5 %)
 */
export function requiredMonthlyPMT(
  monthlyGapReal: number,
  nominalReturnRate: number,
  inflationRate: number,
  yearsToRetirement: number,
  yearsInRetirement: number,
  safeWithdrawalRate = 0.035,
): number {
  if (monthlyGapReal <= 0) return 0;
  if (yearsToRetirement <= 0) return monthlyGapReal; // no time to compound

  const capitalReal = capitalNeededForPayout(monthlyGapReal, safeWithdrawalRate, yearsInRetirement);
  const capitalNominal = capitalReal * Math.pow(1 + inflationRate, yearsToRetirement);

  const n = Math.round(yearsToRetirement * 12);
  const r = mr(nominalReturnRate);
  if (r === 0) return capitalNominal / n;
  return Math.max(0, capitalNominal * r / (Math.pow(1 + r, n) - 1));
}
