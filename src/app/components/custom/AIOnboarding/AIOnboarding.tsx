import type { AIOnboardingProps } from './types';
import { useAIOnboardingFlow } from './hooks/useAIOnboardingFlow';
import { BottomNav } from './components/BottomNav';
import { BonusInfoModal } from './components/BonusInfoModal';
import { DocInfoModal } from './components/DocInfoModal';
import { StepSync } from './components/steps/StepSync';
import { StepFeeling } from './components/steps/StepFeeling';
import { StepDocuments, StepDocumentsIncome } from './components/steps/StepDocuments';
import { StepEmployment } from './components/steps/StepEmployment';
import { StepEducationCheck } from './components/steps/StepEducationCheck';
import { StepBonusResult } from './components/steps/StepBonusResult';
import { StepLoading } from './components/steps/StepLoading';

export function AIOnboarding({ onComplete, onSwitchToPersonas }: AIOnboardingProps) {
  const flow = useAIOnboardingFlow(onComplete, onSwitchToPersonas);

  const isManualIncomePicker = flow.step === 3 && flow.importMethod === 'manual' && flow.showIncomePicker;

  return (
    <div className="bg-white h-screen flex flex-col text-gray-900 max-w-[430px] mx-auto font-sans relative overflow-hidden">

      {/* Progress bar */}
      <div className="flex-none bg-white px-6 py-4">
        {flow.step > 1 && flow.step < 7 && (
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${flow.progress}%` }} />
          </div>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-6 pt-6 min-h-0">

        {flow.step === 1 && <StepSync syncStep={flow.syncStep} />}

        {flow.step === 2 && (
          <StepFeeling
            selectedFeeling={flow.selectedFeeling}
            onSelect={flow.setSelectedFeeling}
          />
        )}

        {flow.step === 3 && !isManualIncomePicker && (
          <StepDocuments
            dropState={flow.dropState}
            processingStep={flow.processingStep}
            docSelected={flow.docSelected}
            importMethod={flow.importMethod}
            onTileClick={() => {
              if (!flow.docSelected) flow.setDocSelected(true);
              else if (flow.importMethod === 'manual') flow.setImportMethod(null);
            }}
            onSelectManual={() => flow.setImportMethod(flow.importMethod === 'manual' ? null : 'manual')}
            onOpenDocModal={() => flow.setShowDocModal(true)}
          />
        )}

        {isManualIncomePicker && (
          <StepDocumentsIncome
            value={flow.customIncomeInput}
            onChange={flow.setCustomIncomeInput}
          />
        )}

        {flow.step === 4 && (
          <StepEmployment
            selectedEmployment={flow.selectedEmployment}
            onSelect={flow.setSelectedEmployment}
          />
        )}

        {flow.step === 5 && (
          <StepEducationCheck
            selectedBonusOption={flow.selectedBonusOption}
            onSelect={flow.setSelectedBonusOption}
            onOpenInfo={() => flow.setShowBonusInfo(true)}
          />
        )}

        {flow.step === 6 && <StepBonusResult educationTimesFound={flow.educationTimesFound} />}

        {flow.step === 7 && <StepLoading loadingText={flow.loadingText} />}

      </div>

      {/* Bottom navigation */}
      {flow.navConfig && (
        <div className="flex-none px-6 pb-8 pt-4 bg-white">
          <BottomNav {...flow.navConfig} />
        </div>
      )}

      {/* Modals */}
      {flow.showBonusInfo && <BonusInfoModal onClose={() => flow.setShowBonusInfo(false)} />}
      {flow.showDocModal  && <DocInfoModal   onClose={() => flow.setShowDocModal(false)}  />}

    </div>
  );
}
