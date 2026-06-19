// ─── Domain Types ──────────────────────────────────────────────────────────────

export type EmploymentType = 'employed' | 'public' | 'selfEmployed';
export type PensionAssetType = 'drv' | 'bAV' | 'riester' | 'ruerup' | 'private';
export type DropState = 'idle' | 'processing' | 'done';
export type ImportMethod = 'upload' | 'manual' | null;
export type FeelingOption = 'ignore' | 'worried' | 'relaxed';
export type BonusOption = 'yes' | 'no';

export interface PensionAsset {
  type: PensionAssetType;
  provider: string;
  monthlyPayout: number;
  inflationAdjusted: boolean;
}

export interface AIOnboardingData {
  age: number;
  monthlySavings: number;
  targetPension: number;
  initialCapital: number;
  income: number;
  pensionAssets: PensionAsset[];
  /** Always 0 — no speculative amounts are computed without actual DRV data. */
  drvBonus: number;
  employmentType: EmploymentType;
  /** True when user reported school/university time after age 17 (Anrechnungszeiten). */
  educationTimesFound: boolean;
}

// ─── Component Props ───────────────────────────────────────────────────────────

export interface AIOnboardingProps {
  onComplete: (data: AIOnboardingData) => void;
  onSwitchToPersonas: () => void;
}

export interface BottomNavConfig {
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  onBack?: () => void;
  hideNext?: boolean;
}
