import type { PensionAsset } from './types';

export const TR_AGE = 32;
export const TR_SAVINGS = 150;
export const ITEM_H = 64;

export const INCOMES = Array.from({ length: 66 }, (_, i) => (i + 5) * 100);

export const MOCK_DETECTED: PensionAsset[] = [
  { type: 'drv',     provider: 'Deutsche Rentenversicherung', monthlyPayout: 1450, inflationAdjusted: true  },
  { type: 'bAV',     provider: 'Allianz',                    monthlyPayout: 280,  inflationAdjusted: false },
  { type: 'riester', provider: 'Deka Investment',            monthlyPayout: 115,  inflationAdjusted: false },
];

export const DOC_CATEGORIES = [
  { label: 'Gesetzlich',  docs: ['DRV Renteninformation', 'Beamten-Versorgungsauskunft'] },
  { label: 'Betrieblich', docs: ['bAV Standmitteilung', 'VBL-Nachweis', 'Direktversicherung'] },
  { label: 'Privat',      docs: ['Riester-/Rürup-Bescheinigung', 'Private Lebensversicherung', 'Externer Depotauszug'] },
];

export const MOCK_DOC_TILES = [
  { label: 'DRV Renteninformation',       sub: 'Deutsche Rentenversicherung', dir: 'left'  },
  { label: 'Allianz bAV Standmitteilung', sub: 'Betriebliche Altersvorsorge', dir: 'right' },
  { label: 'Deka Riester-Bescheinigung',  sub: 'Riester-Rente',               dir: 'left'  },
] as const;

export function getDefaultTargetByAge(age: number): number {
  if (age < 35) return 2000;
  if (age < 50) return 2400;
  return 2800;
}
