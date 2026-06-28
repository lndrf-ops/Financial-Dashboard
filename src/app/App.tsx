import { useEffect, useState } from "react";

import { usePensionMath } from "./hooks/usePensionMath";
import { useAppState } from "./hooks/useAppState";
import { useFeatureTutorial } from "./hooks/useFeatureTutorial";
import { FEATURE_STEPS } from "./components/tutorial/featureSteps";

import { WelcomeView } from "./components/WelcomeView";
import { Confetti } from "./components/Confetti";
import { NotificationToast } from "./components/NotificationToast";
import { LogoutConfirmSheet } from "./components/LogoutConfirmSheet";
import { BottomNavBar } from "./components/BottomNavBar";

import { FeatureTutorial } from "./components/tutorial/FeatureTutorial";
import { DashboardView } from "./components/dashboard/DashboardView";

import { AIOnboarding } from "./components/custom/AIOnboarding";
import { Onboarding } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { PersonalDataView } from "./components/custom/PersonalDataView";
import { GuidedSmartChat } from "./components/custom/GuidedSmartChat";

export default function App() {
  const s = useAppState();
  const ft = useFeatureTutorial(s.activeView);
  const [profileFocusParams, setProfileFocusParams] = useState(false);

  const {
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
    combinedMonthlyNominal,
    totalNetWorthAtRetirement,
    avdPayoutNominal,
  } = usePensionMath({
    currentAge:             s.currentAge,
    retirementAge:          s.retirementAge[0],
    lifeExpectancy:         s.lifeExpectancy[0],
    monthlyContribution:    s.monthlyContribution[0],
    dynamicSavings:         s.dynamicSavings,
    expectedReturn:         s.expectedReturn[0],
    inflation:              s.inflation[0],
    targetPension:          s.targetPensionReal[0],
    dynamicAssets:          s.dynamicAssets,
    vlActive:               s.vlActive,
    bavBruttoInvest:        s.bavBruttoInvest,
    lifeEvents:             s.lifeEvents,
    stressTests:            s.stressTests,
    avdActive:              s.avdActive,
    avdMonthlyContribution: s.avdMonthlyContribution[0],
    avdAccumulated:         0,
  });

  const activeLifeExpectancy = s.stressTests.longevity ? 98 : s.lifeExpectancy[0];

  useEffect(() => {
    if (isPositive && !s.hasShownSuccessToast && s.activeView === 'dashboard') {
      s.setNotification("Glückwunsch! Deine Rentenlücke ist geschlossen. 🎯");
      s.setHasShownSuccessToast(true);
      s.setShowConfetti(true);
      setTimeout(() => s.setShowConfetti(false), 4500);
      setTimeout(() => s.setNotification(null), 5500);
    } else if (!isPositive && s.hasShownSuccessToast) {
      s.setHasShownSuccessToast(false);
    }
  }, [isPositive, s.hasShownSuccessToast, s.activeView]);

  // ── Full-screen views (no nav) ────────────────────────────────────────────

  if (s.activeView === 'welcome') return <WelcomeView onStart={() => s.setActiveView('aionboarding')} onPersonas={() => s.setActiveView('onboarding')} />;
  if (s.activeView === 'aionboarding') return <AIOnboarding onComplete={s.handleAIOnboardingComplete} onSwitchToPersonas={() => s.setActiveView('welcome')} />;
  if (s.activeView === 'onboarding')   return <Onboarding onSelectPersona={s.handleLoadPersona} onSwitchToAI={() => s.setActiveView('aionboarding')} />;
  if (s.activeView === 'personalData') return <PersonalDataView onBack={() => s.setActiveView('profile')} />;

  if (s.activeView === 'optimize') {
    const bavAlreadyExists = s.dynamicAssets.some(a => a.id === 'company' && a.payout > 0);
    return (
      <OptimizationPlan
        onBack={() => s.setActiveView('dashboard')}
        projectedMonthly={realPurchasingPowerMonthly}
        targetPension={s.targetPensionReal[0]}
        diff={diff}
        monthlyContribution={s.monthlyContribution[0]}
        setMonthlyContribution={val => s.setMonthlyContribution([val])}
        expectedReturn={s.expectedReturn[0]}
        setExpectedReturn={val => s.setExpectedReturn([val])}
        retirementAge={s.retirementAge[0]}
        setRetirementAge={val => s.setRetirementAge([val])}
        vlActive={s.vlActive}
        setVlActive={s.setVlActive}
        bavNettoVerzicht={s.bavNettoVerzicht}
        setBavNettoVerzicht={s.setBavNettoVerzicht}
        suggestedBavNettoAmount={leverBavNetto}
        drvBonus={s.drvBonus}
        bavAlreadyExists={bavAlreadyExists}
        currentAge={s.currentAge}
        lifeExpectancy={s.lifeExpectancy[0]}
        inflation={s.inflation[0]}
      />
    );
  }

  // ── Shell with bottom nav ─────────────────────────────────────────────────

  return (
    <div className="bg-white min-h-screen text-black max-w-[430px] mx-auto font-sans overflow-x-hidden relative">

      {s.showConfetti && <Confetti />}

      {ft.featureTutorialTab && (
        <FeatureTutorial
          tab={ft.featureTutorialTab}
          step={ft.featureTutorialStep}
          total={FEATURE_STEPS[ft.featureTutorialTab]?.length ?? 0}
          onNext={ft.nextStep}
          onComplete={ft.complete}
        />
      )}

{s.notification && <NotificationToast message={s.notification} onDismiss={() => s.setNotification(null)} />}

      {s.activeView === 'dashboard' && (
        <DashboardView
          userName={s.userName}
          retirementAge={s.retirementAge[0]}
          monthlyContribution={s.monthlyContribution[0]}
          yearsLeft={s.retirementAge[0] - s.currentAge}
          realPurchasingPowerMonthly={realPurchasingPowerMonthly}
          targetPensionReal={s.targetPensionReal[0]}
          additionalMonthlyPayoutNominal={additionalMonthlyPayoutNominal}
          capitalAtRetirement={capitalAtRetirement}
          inflationFactor={inflationFactor}
          combinedMonthlyNominal={combinedMonthlyNominal}
          dynamicAssets={s.dynamicAssets}
          avdPayoutNominal={avdPayoutNominal}
          isPositive={isPositive}
          leverBavNetto={leverBavNetto}
          leverSavings={leverSavings}
          currentGap={currentGap}
          vlActive={s.vlActive}
          onBellClick={() => s.triggerNotification(`Dein Sparplan über ${s.monthlyContribution[0]} € wurde erfolgreich ausgeführt.`)}
          onHelpClick={() => ft.open('dashboard')}
          onLogoutClick={() => s.setShowLogoutConfirm(true)}
          onUpdateAsset={s.handleUpdateAsset}
          onOptimize={() => s.setActiveView('optimize')}
          onSimulate={() => { setProfileFocusParams(true); s.setActiveView('profile'); }}
        />
      )}

      {s.activeView === 'invest' && (
        <div className="pb-24">
          <InvestView monthlyContribution={s.monthlyContribution[0]} expectedReturn={s.expectedReturn[0]} assets={s.dynamicAssets} onHelp={() => ft.open('invest')} />
        </div>
      )}

      {s.activeView === 'simulate' && (
        <div className="pb-24">
          <SimulateView
            currentAge={s.currentAge}
            retirementAge={s.retirementAge[0]}
            lifeEvents={s.lifeEvents}
            setLifeEvents={s.setLifeEvents}
            stressTests={s.stressTests}
            setStressTests={s.setStressTests}
            avdActive={s.avdActive}
            setAvdActive={s.setAvdActive}
            avdMonthlyContribution={s.avdMonthlyContribution[0]}
            setAvdMonthlyContribution={val => s.setAvdMonthlyContribution([val])}
            onHelp={() => ft.open('simulate')}
          />
        </div>
      )}

      {s.activeView === 'profile' && (
        <div className="pb-24">
          <ProfileView
            inflation={s.inflation} setInflation={s.setInflation}
            retirementAge={s.retirementAge} setRetirementAge={s.setRetirementAge}
            monthlyContribution={s.monthlyContribution} setMonthlyContribution={s.setMonthlyContribution}
            expectedReturn={s.expectedReturn} setExpectedReturn={s.setExpectedReturn}
            lifeExpectancy={s.lifeExpectancy} setLifeExpectancy={s.setLifeExpectancy}
            targetPension={s.targetPensionReal} setTargetPension={s.setTargetPensionReal}
            dynamicSavings={s.dynamicSavings} setDynamicSavings={s.setDynamicSavings}
            projectedMonthly={realPurchasingPowerMonthly}
            diff={diff}
            isPositive={isPositive}
            yearsLeft={s.retirementAge[0] - s.currentAge}
            onNavigateToPersonalData={() => s.setActiveView('personalData')}
            onSyncComplete={s.handleDataSync}
            vlActive={s.vlActive}
            bavNetto={s.bavNettoVerzicht[0]}
            focusSimParams={profileFocusParams}
            onHelp={() => ft.open('profile')}
          />
        </div>
      )}

      {s.showLogoutConfirm && (
        <LogoutConfirmSheet
          onCancel={() => s.setShowLogoutConfirm(false)}
          onConfirm={() => { s.setShowLogoutConfirm(false); s.setActiveView('welcome'); }}
        />
      )}

      <div
        className="fixed inset-0 z-40 max-w-[430px] mx-auto flex flex-col bg-white"
        style={{ display: s.activeView === 'chat' ? 'flex' : 'none' }}
      >
        <GuidedSmartChat
          key={s.chatResetKey}
          monthlyContribution={s.monthlyContribution[0]}
          setMonthlyContribution={val => s.setMonthlyContribution([val])}
          retirementAge={s.retirementAge[0]}
          setRetirementAge={val => s.setRetirementAge([val])}
          lifeEvents={s.lifeEvents}
          setLifeEvents={s.setLifeEvents}
          stressTests={s.stressTests}
          setStressTests={s.setStressTests}
          avdActive={s.avdActive}
          setAvdActive={s.setAvdActive}
          onReset={() => s.setChatResetKey(k => k + 1)}
          onHelp={() => ft.open('chat')}
        />
      </div>

      <BottomNavBar
        activeView={s.activeView}
        onNavigate={id => { if (id === 'profile') setProfileFocusParams(false); ft.handleTabNav(id, s.setActiveView); }}
      />
    </div>
  );
}
