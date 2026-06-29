import { useState, useEffect } from 'react';
import type {
  AIOnboardingData, AIOnboardingProps, BottomNavConfig,
  PensionAsset, EmploymentType, DropState, ImportMethod,
  FeelingOption, BonusOption,
} from '../types';
import { TR_AGE, TR_SAVINGS, MOCK_DETECTED, getDefaultTargetByAge } from '../constants';

// Derives employmentType from detected pension assets.
// bAV proves employment, Rürup proves self-employment, VBL proves public service.
// Returns null when the documents don't carry enough signal (e.g. only DRV + Riester).
function inferEmploymentFromAssets(assets: PensionAsset[]): EmploymentType | null {
  if (assets.some(a => a.type === 'bAV')) return 'employed';
  if (assets.some(a => a.type === 'ruerup')) return 'selfEmployed';
  if (assets.some(a => a.provider.toLowerCase().includes('vbl') || a.provider.toLowerCase().includes('beamt'))) return 'public';
  return null;
}

const TOTAL_STEPS = 7;

export interface AIOnboardingFlowState {
  // navigation
  step: number;
  progress: number;
  navConfig: BottomNavConfig | null;

  // step 1
  syncStep: number;

  // step 3 – document import
  importMethod: ImportMethod;
  dropState: DropState;
  processingStep: number;
  docSelected: boolean;
  showDocModal: boolean;
  setImportMethod: (m: ImportMethod) => void;
  setDocSelected: (v: boolean) => void;
  setShowDocModal: (v: boolean) => void;

  // step 3 – manual income sub-step
  showIncomePicker: boolean;
  customIncomeInput: string;
  setShowIncomePicker: (v: boolean) => void;
  setCustomIncomeInput: (v: string) => void;

  // step 2
  selectedFeeling: FeelingOption | null;
  setSelectedFeeling: (f: FeelingOption) => void;

  // step 4
  selectedEmployment: EmploymentType | null;
  setSelectedEmployment: (e: EmploymentType) => void;

  // step 5
  selectedBonusOption: BonusOption | null;
  showBonusInfo: boolean;
  setSelectedBonusOption: (o: BonusOption) => void;
  setShowBonusInfo: (v: boolean) => void;

  // step 6
  educationTimesFound: boolean;

  // step 7
  loadingText: string;

  // derived domain data
  income: number;
  pensionAssets: PensionAsset[];
  setPensionAssets: React.Dispatch<React.SetStateAction<PensionAsset[]>>;
}

export function useAIOnboardingFlow(
  onComplete: AIOnboardingProps['onComplete'],
  onSwitchToPersonas: AIOnboardingProps['onSwitchToPersonas'],
): AIOnboardingFlowState {

  const [step, setStep] = useState(1);
  const [syncStep, setSyncStep] = useState(0);

  const [importMethod, setImportMethod] = useState<ImportMethod>(null);
  const [income, setIncome] = useState(3000);
  const [targetPension, setTargetPension] = useState(getDefaultTargetByAge(TR_AGE));
  const [pensionAssets, setPensionAssets] = useState<PensionAsset[]>([]);

  const [dropState, setDropState] = useState<DropState>('idle');
  const [processingStep, setProcessingStep] = useState(0);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docSelected, setDocSelected] = useState(false);

  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [customIncomeInput, setCustomIncomeInput] = useState('3000');

  const [loadingText, setLoadingText] = useState('Analysiere Daten...');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingOption | null>(null);
  const [selectedEmployment, setSelectedEmployment] = useState<EmploymentType | null>(null);
  const [selectedBonusOption, setSelectedBonusOption] = useState<BonusOption | null>(null);
  const [educationTimesFound, setEducationTimesFound] = useState(false);
  const [showBonusInfo, setShowBonusInfo] = useState(false);

  // ── Step 1: TR profile sync animation ────────────────────────────────────────
  useEffect(() => {
    if (step !== 1) return;
    const t1 = setTimeout(() => setSyncStep(1), 800);
    const t2 = setTimeout(() => setSyncStep(2), 1700);
    const t3 = setTimeout(() => setStep(2), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step]);

  // ── Step 3: document analysis animation ──────────────────────────────────────
  useEffect(() => {
    if (step !== 3 || dropState !== 'processing') return;
    const t1 = setTimeout(() => setProcessingStep(1), 1000);
    const t2 = setTimeout(() => setProcessingStep(2), 2200);
    const t3 = setTimeout(() => setProcessingStep(3), 3400);
    const t4 = setTimeout(() => { setDropState('done'); setPensionAssets(MOCK_DETECTED); }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step, dropState]);

  // ── Step 7: final loading → onComplete ───────────────────────────────────────
  useEffect(() => {
    if (step !== 7) return;
    const t1 = setTimeout(() => setLoadingText('Berechne Steuern & Inflation...'), 800);
    const t2 = setTimeout(() => setLoadingText('Konsolidiere alle Rentenquellen...'), 1600);
    const t3 = setTimeout(() => setLoadingText('Dein Dashboard ist bereit!'), 2400);
    const t4 = setTimeout(() => {
      const result: AIOnboardingData = {
        age: TR_AGE,
        monthlySavings: TR_SAVINGS,
        targetPension,
        initialCapital: 0,
        income,
        pensionAssets,
        drvBonusFound: educationTimesFound,
        employmentType: selectedEmployment ?? 'employed',
        educationTimesFound,
        feeling: selectedFeeling ?? undefined,
      };
      onComplete(result);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step, targetPension, income, pensionAssets, selectedEmployment, educationTimesFound, onComplete]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleNext = () => setStep(prev => prev + 1);

  const handleBack = () => {
    if (showIncomePicker) {
      setShowIncomePicker(false);
    } else if (docSelected && dropState === 'idle') {
      setDocSelected(false);
    } else if (importMethod === 'manual') {
      setImportMethod(null);
    } else if (dropState !== 'idle') {
      setDropState('idle');
      setProcessingStep(0);
      setPensionAssets([]);
      setDocSelected(false);
    } else if (step > 2) {
      setStep(prev => prev - 1);
    }
  };

  // ── Nav config ────────────────────────────────────────────────────────────────

  const navConfig = ((): BottomNavConfig | null => {
    if (step === 1 || step === 7) return null;

    if (step === 2) return {
      onNext: handleNext,
      nextDisabled: !selectedFeeling,
      nextLabel: 'Weiter',
      onBack: onSwitchToPersonas,
    };

    if (step === 3 && importMethod === 'manual' && showIncomePicker) {
      return {
        onNext: () => {
          const v = parseInt(customIncomeInput);
          const salary = !isNaN(v) && v > 0 ? v : 2500;
          setIncome(salary);
          setTargetPension(Math.round(salary * 0.8));
          setPensionAssets([{
            type: 'drv',
            provider: 'Schätzung via Gehalt',
            monthlyPayout: Math.round(salary * 0.45),
            inflationAdjusted: true,
          }]);
          handleNext();
        },
        nextDisabled: false,
        nextLabel: 'Weiter',
        onBack: handleBack,
      };
    }

    if (step === 3 && importMethod === 'manual') return {
      onNext: () => setShowIncomePicker(true),
      nextDisabled: false,
      nextLabel: 'Weiter',
      onBack: handleBack,
    };

    if (step === 3 && dropState === 'done') return {
      onNext: () => {
        const inferred = inferEmploymentFromAssets(pensionAssets);
        if (inferred) {
          setSelectedEmployment(inferred);
          setStep(5); // skip StepEmployment — already determined by documents
        } else {
          handleNext(); // no signal → show manual selection
        }
      },
      nextDisabled: false,
      nextLabel: 'Werte übernehmen',
      onBack: handleBack,
    };

    if (step === 3 && dropState === 'processing') return {
      nextDisabled: true,
      nextLabel: 'Analysiere...',
      onBack: handleBack,
    };

    if (step === 3) return {
      onNext: () => { setDropState('processing'); setProcessingStep(0); },
      nextDisabled: !docSelected && importMethod !== 'manual',
      nextLabel: 'Weiter',
      onBack: handleBack,
    };

    if (step === 4) return {
      onNext: handleNext,
      nextDisabled: !selectedEmployment,
      nextLabel: 'Weiter',
      onBack: handleBack,
    };

    if (step === 5) return {
      onNext: () => {
        if (!selectedBonusOption) return;
        setEducationTimesFound(selectedBonusOption === 'yes');
        handleNext();
      },
      nextDisabled: !selectedBonusOption,
      nextLabel: 'Weiter',
      onBack: handleBack,
    };

    if (step === 6) return {
      onNext: handleNext,
      nextDisabled: false,
      nextLabel: 'Weiter zum Dashboard',
      onBack: handleBack,
    };

    return null;
  })();

  return {
    step, progress: (step / (TOTAL_STEPS - 1)) * 100, navConfig,
    syncStep,
    importMethod, dropState, processingStep, docSelected, showDocModal,
    setImportMethod, setDocSelected, setShowDocModal,
    showIncomePicker, customIncomeInput,
    setShowIncomePicker, setCustomIncomeInput,
    selectedFeeling, setSelectedFeeling,
    selectedEmployment, setSelectedEmployment,
    selectedBonusOption, showBonusInfo,
    setSelectedBonusOption, setShowBonusInfo,
    educationTimesFound,
    loadingText,
    income, pensionAssets, setPensionAssets,
  };
}
