import { Asset } from '../../custom/AssetBreakdown';

interface DashboardDerivedInput {
  realPurchasingPowerMonthly: number;
  targetPensionReal: number;
  additionalMonthlyPayoutNominal: number;
  capitalAtRetirement: number;
  inflationFactor: number;
  dynamicAssets: Asset[];
  avdPayoutNominal: number;
}

export interface SegmentDatum {
  label: string;
  value: number;
  color: string;
  i: number;
  segArc: number;
  startArc: number;
  side: 'left' | 'right';
}

const RING_RADIUS = 80;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SEGMENT_GAP = 4;

export function useDashboardDerived({
  realPurchasingPowerMonthly,
  targetPensionReal,
  additionalMonthlyPayoutNominal,
  capitalAtRetirement,
  inflationFactor,
  dynamicAssets,
  avdPayoutNominal,
}: DashboardDerivedInput) {
  const percentage = Math.round((realPurchasingPowerMonthly / targetPensionReal) * 100);
  const cappedPercentage = Math.min(percentage, 100);

  const ringBadgeBg =
    percentage >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
    percentage >= 85  ? 'bg-teal-50 border-teal-200 text-teal-600' :
    percentage >= 65  ? 'bg-amber-50 border-amber-200 text-amber-600' :
    percentage >= 40  ? 'bg-orange-50 border-orange-200 text-orange-600' :
                        'bg-red-50 border-red-200 text-red-500';

  const segmentPalette: string[] =
    percentage >= 100 ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] :
    percentage >= 85  ? ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] :
    percentage >= 65  ? ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'] :
    percentage >= 40  ? ['#f97316', '#fb923c', '#fdba74', '#fed7aa'] :
                        ['#ef4444', '#f87171', '#fca5a5', '#fecaca'];

  const statutoryValue   = dynamicAssets.find(a => a.id === 'statutory')?.payout   ?? 0;
  const companyValue     = dynamicAssets.find(a => a.id === 'company')?.payout     ?? 0;
  const realEstatePayout = dynamicAssets.find(a => a.id === 'realestate')?.payout  ?? 0;

  const rawSources = [
    { label: "Gesetzl. Rente",  value: Math.round(statutoryValue   * inflationFactor) },
    { label: "Portfolio",       value: Math.round(additionalMonthlyPayoutNominal * inflationFactor) },
    { label: "Betriebl. Rente", value: Math.round(companyValue     * inflationFactor) },
    { label: "Immobilie",       value: Math.round(realEstatePayout * inflationFactor) },
    { label: "Vorsorgedepot",   value: Math.round(avdPayoutNominal * inflationFactor) },
  ].filter(s => s.value > 0).map((s, i) => ({ ...s, color: segmentPalette[Math.min(i, segmentPalette.length - 1)] }));

  const totalChartValue = rawSources.reduce((sum, s) => sum + s.value, 0);
  const filledArc = (cappedPercentage / 100) * RING_CIRCUMFERENCE;

  let _cum = 0;
  const segmentData: SegmentDatum[] = rawSources.map((s, i) => {
    const slice = totalChartValue > 0 ? (s.value / totalChartValue) * filledArc : 0;
    const segArc = Math.max(0, slice - SEGMENT_GAP);
    const startArc = _cum;
    _cum += slice;
    const midAngle = ((startArc + slice / 2) / RING_CIRCUMFERENCE) * 360;
    return { ...s, i, segArc, startArc, side: midAngle < 180 ? 'right' : 'left' };
  });

  const displayAssets = dynamicAssets.map(asset => {
    if (asset.id === 'etf') {
      return {
        ...asset,
        payout: Math.round(additionalMonthlyPayoutNominal),
        accumulatedValue: Math.round(capitalAtRetirement),
        accumulatedLabel: 'Endkapital',
      };
    }
    if (asset.id === 'avd') {
      return {
        ...asset,
        payout: Math.round(avdPayoutNominal),
        accumulatedLabel: 'Endkapital',
      };
    }
    return asset;
  });

  return {
    percentage,
    ringBadgeBg,
    segmentData,
    displayAssets,
    ringRadius: RING_RADIUS,
    ringCircumference: RING_CIRCUMFERENCE,
  };
}
