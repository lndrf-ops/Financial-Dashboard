import React, { useState, useEffect, useLayoutEffect } from "react";
import { usePensionMath } from "./hooks/usePensionMath";
import { TrendingUp, Bell, LogOut, Building2, Briefcase, Home, Landmark, Bitcoin, X, CheckCircle2, ArrowRight, Users, LayoutDashboard, Sliders, User, HelpCircle, MessageCircle } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { Onboarding, Persona } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView, LifeEvent, StressTests } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";
import { AIOnboarding, AIOnboardingData } from "./components/custom/AIOnboarding";
import { PersonalDataView } from "./components/custom/PersonalDataView";
import { GuidedSmartChat } from "./components/custom/GuidedSmartChat";

// ─── Tutorial ────────────────────────────────────────────────────────────────

type DashboardView = 'dashboard' | 'invest' | 'simulate' | 'profile';

const TUTORIAL_STEPS: { title: string; text: string; view: DashboardView }[] = [
  {
    title: "Deine Rente auf einen Blick.",
    text: "Hier siehst du, wie viel du monatlich ausgeben kannst, wenn du in Rente gehst. Gesetzliche Rente, Betriebsrente und dein ETF-Sparplan werden kombiniert.",
    view: 'dashboard',
  },
  {
    title: "Dein Geld arbeitet für dich.",
    text: "Passe deine monatliche Sparrate an und verfolge, wie dein erspartes Geld mit der Zeit immer schneller wächst — Zinsen auf Zinsen machen den Unterschied.",
    view: 'invest',
  },
  {
    title: "Was wäre, wenn...?",
    text: "Das Leben passiert. Simuliere Auszeiten, Immobilienkäufe oder Marktcrashs und sieh sofort die Auswirkungen auf deine Rente.",
    view: 'simulate',
  },
  {
    title: "Deine Daten, deine Kontrolle.",
    text: "Passe Renteneintrittsalter, Inflation und Lebenserwartung an. Du hast jederzeit die volle Kontrolle über alle Annahmen.",
    view: 'profile',
  },
];

function TutorialOverlay({
  step,
  onNext,
  onComplete,
}: {
  step: number;
  onNext: () => void;
  onComplete: () => void;
}) {
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  return (
    <>
      {/* Dim background */}
      <div className="fixed inset-0 bg-slate-950/40 z-[90]" />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] bg-slate-950/85 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl px-6 pt-7 pb-10 animate-in slide-in-from-bottom-8 fade-in duration-300">
        {/* Pagination pill-dots */}
        <div className="flex justify-center items-center gap-2 mb-7">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-white' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step content – key forces re-animation on step change */}
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Schritt {step + 1} von {TUTORIAL_STEPS.length}
          </p>
          <h2 className="text-[22px] font-black text-white tracking-tight leading-tight mb-3">
            {current.title}
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
            {current.text}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={isLast ? onComplete : onNext}
          className="w-full bg-white text-slate-950 font-extrabold text-[15px] py-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          {isLast ? 'Verstanden' : 'Weiter'}
        </button>
      </div>
    </>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const colors = ['#000000', '#374151', '#6B7280', '#10b981', '#f59e0b', '#f43f5e'];
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {[...Array(75)].map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const animDuration = `${Math.random() * 2 + 3}s`;
        const animDelay = `${Math.random() * 0.5}s`;
        const size = Math.random() > 0.5 ? 'w-2 h-5' : 'w-2.5 h-2.5';
        return (
          <div
            key={i}
            className={`absolute top-[-10%] ${size} rounded-sm opacity-90`}
            style={{
              left,
              backgroundColor: color,
              animation: `fall ${animDuration} linear ${animDelay} forwards`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Per-Tab Feature Tutorial ─────────────────────────────────────────────────

interface FeatureStep {
  title: string;
  text: string;
  targetId: string;
}

const FEATURE_STEPS: Record<string, FeatureStep[]> = {
  dashboard: [
    { title: "Dein Rentenring", text: "Der Ring zeigt deinen Rentendeckungsgrad auf einen Blick. Jedes Segment steht für eine Rentenquelle — tippe drauf um Details zu sehen.", targetId: "tutorial-dashboard-ring" },
    { title: "Dein Deckungsgrad", text: "Diese Zahl zeigt, wie viel Prozent deines Rentenziels du bereits abdeckst. 100% bedeutet: dein Wunscheinkommen im Alter ist vollständig gesichert.", targetId: "tutorial-dashboard-badge" },
    { title: "Deine 3 größten Hebel", text: "FutureMe berechnet automatisch die 3 effektivsten Maßnahmen zur Schließung deiner Lücke — sortiert nach Wirkung.", targetId: "tutorial-dashboard-hebel" },
    { title: "Deine Rentenbausteine", text: "Tippe auf einen Baustein um Werte direkt anzupassen — z.B. deine gesetzliche Rente oder den ETF-Depotwert.", targetId: "tutorial-dashboard-assets" },
  ],
  invest: [
    { title: "Dein monatlicher Sparplan", text: "Der Betrag, der jeden Monat automatisch über dein Trade Republic Depot investiert wird — direkt aus dem Onboarding übernommen.", targetId: "tutorial-invest-savings" },
    { title: "10-Jahres-Vorschau", text: "Der Chart zeigt die Vermögensentwicklung der nächsten 10 Jahre bei gleichbleibender Sparrate und 7% Rendite pro Jahr.", targetId: "tutorial-invest-chart" },
    { title: "Deine Ausführung", text: "Dein Kapital wird auf MSCI World ETF und optional Bitcoin aufgeteilt — mit einem Klick direkt in deinem TR-Depot ausführbar.", targetId: "tutorial-invest-execution" },
  ],
  simulate: [
    { title: "Stresstests", text: "Teste dein Portfolio gegen reale Extremszenarien: Börsencrash, hohe Inflation oder überdurchschnittliche Lebenserwartung.", targetId: "tutorial-simulate-stresstests" },
    { title: "Lebensereignisse", text: "Simuliere echte Momente: Elternzeit, Hauskauf, Jobwechsel oder Gehaltssprünge. Sieh sofort die Auswirkung auf dein Rentenkonto.", targetId: "tutorial-simulate-events" },
    { title: "Live-Auswirkung", text: "Alle Szenarien werden sofort auf deinen Rentenring angerechnet — wechsel zur Übersicht um das Ergebnis zu sehen.", targetId: "tutorial-simulate-events" },
  ],
  profile: [
    { title: "Dein Account", text: "Passe deine persönlichen Daten, Steuerklasse und Risikoprofil an — alles wird direkt aus deinem Trade Republic Konto übernommen.", targetId: "tutorial-profile-account" },
    { title: "Daten-Sync", text: "Lade deinen Rentenbescheid hoch oder gleiche Werte mit der Deutschen Rentenversicherung ab — für eine präzise Netto-Berechnung.", targetId: "tutorial-profile-datasync" },
    { title: "Simulations-Parameter", text: "Passe Renteneintrittsalter, monatliche Sparrate und Renditeerwartung an. Alle Berechnungen aktualisieren sich in Echtzeit.", targetId: "tutorial-profile-simparams" },
  ],
  chat: [
    { title: "Finn – dein KI-Assistent", text: "Finn kennt all deine Rentendaten und kann Szenarien direkt für dich aktivieren. Kein Menü, kein Suchen — einfach fragen.", targetId: "tutorial-chat-header" },
    { title: "Smarte Vorschläge", text: "Finn schlägt dir die wirkungsvollsten Aktionen vor. Tipp auf einen Chip und er antwortet sofort — und passt deine Simulation live an.", targetId: "tutorial-chat-chips" },
    { title: "Eigene Fragen stellen", text: "Schreib Finn direkt: z.B. 'Was passiert bei Inflation?' oder 'Erhöhe meine Sparrate'. Er versteht natürliche Sprache.", targetId: "tutorial-chat-input" },
  ],
};

function FeatureTutorial({ tab, step, total, onNext, onComplete }: {
  tab: string; step: number; total: number; onNext: () => void; onComplete: () => void;
}) {
  const feature = FEATURE_STEPS[tab]?.[step];
  const [spotRect, setSpotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!feature?.targetId) return;
    const el = document.getElementById(feature.targetId);
    if (!el) return;

    const navH = 68;
    const raw = el.getBoundingClientRect();
    const absoluteTop = raw.top + window.scrollY;
    const usableH = window.innerHeight - navH;
    const targetScrollY = Math.max(0, absoluteTop - Math.round((usableH - raw.height) / 2));
    window.scrollTo(0, targetScrollY);
    document.body.style.overflow = 'hidden';

    const r = el.getBoundingClientRect();
    setSpotRect({ top: r.top, left: r.left, width: r.width, height: r.height });

    const handleResize = () => {
      const rr = el.getBoundingClientRect();
      setSpotRect({ top: rr.top, left: rr.left, width: rr.width, height: rr.height });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [feature?.targetId]);

  if (!feature) { onComplete(); return null; }

  const pad = 10;
  const vh = window.innerHeight;
  const navH = 68;
  const isLast = step === total - 1;

  // Adjust left coord for centered 430px container on wide screens
  const containerOffset = Math.max(0, (window.innerWidth - 430) / 2);
  const spotTop  = spotRect ? spotRect.top  - pad : -9999;
  const spotLeft = spotRect ? spotRect.left - containerOffset - pad : 0;
  const spotW    = spotRect ? spotRect.width  + pad * 2 : 0;
  const spotH    = spotRect ? spotRect.height + pad * 2 : 0;

  const cardH = 192;
  const gap = 14;
  const spaceBelow = vh - navH - (spotTop + spotH) - gap;
  const cardTop = spotRect
    ? spaceBelow >= cardH ? spotTop + spotH + gap : Math.max(8, spotTop - gap - cardH)
    : vh / 2;

  return (
    <div
      className="fixed inset-0 z-[90]"
      style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0, pointerEvents: 'none' }}
    >
      {/* Box-shadow spotlight — transparent div; the spread shadow creates the dim overlay with a cutout hole */}
      <div
        style={{
          position: 'absolute',
          top: spotTop,
          left: spotLeft,
          width: spotW,
          height: spotH,
          borderRadius: 20,
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.82)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          transition: 'top 320ms cubic-bezier(0.4,0,0.2,1), left 320ms cubic-bezier(0.4,0,0.2,1), width 320ms cubic-bezier(0.4,0,0.2,1), height 320ms cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
          zIndex: 91,
        }}
      />

      {/* Callout card — re-mounts on each step for the fade-in animation */}
      <div
        key={`${tab}-${step}`}
        className="absolute left-4 right-4 bg-white rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{ top: cardTop, zIndex: 92, pointerEvents: 'auto' }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[16px] font-black text-black leading-tight">{feature.title}</h3>
          <button onClick={onComplete} className="text-gray-300 hover:text-black cursor-pointer shrink-0 mt-0.5">
            <X size={15} />
          </button>
        </div>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{feature.text}</p>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 flex-1">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-300 ${i === step ? 'bg-black' : i < step ? 'bg-gray-400' : 'bg-gray-100'}`} />
            ))}
          </div>
          <button
            onClick={isLast ? onComplete : onNext}
            className="bg-black text-white text-[13px] font-extrabold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            {isLast ? 'Fertig' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeView, setActiveView] = useState<'welcome' | 'aionboarding' | 'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData' | 'chat'>('welcome');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Nav dock hover
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Chat persistence
  const [chatResetKey, setChatResetKey] = useState(0);

  // Per-tab feature tutorial
  const [featureTutorialTab, setFeatureTutorialTab] = useState<string | null>(null);
  const [featureTutorialStep, setFeatureTutorialStep] = useState(0);
  const [seenTabTutorials, setSeenTabTutorials] = useState<Set<string>>(new Set());
  const handleTabNav = (id: string) => {
    setActiveView(id as any);
    if (!seenTabTutorials.has(id) && FEATURE_STEPS[id]) {
      setTimeout(() => {
        setFeatureTutorialTab(id);
        setFeatureTutorialStep(0);
        setSeenTabTutorials(prev => new Set([...prev, id]));
      }, 350);
    }
  };

  useEffect(() => {
    if (activeView === 'dashboard' && !seenTabTutorials.has('dashboard') && FEATURE_STEPS['dashboard']) {
      const timer = setTimeout(() => {
        setFeatureTutorialTab('dashboard');
        setFeatureTutorialStep(0);
        setSeenTabTutorials(prev => new Set([...prev, 'dashboard']));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

  const [userName, setUserName] = useState("Lena");
  const [currentAge, setCurrentAge] = useState(32);
  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);
  const [lifeExpectancy, setLifeExpectancy] = useState([85]);
  const [monthlyContribution, setMonthlyContribution] = useState([150]);
  const [dynamicSavings, setDynamicSavings] = useState(false);
  const [expectedReturn, setExpectedReturn] = useState([7.0]);
  const [targetPensionReal, setTargetPensionReal] = useState([2100]);

  const [vlActive, setVlActive] = useState(false);
  const [bavNettoVerzicht, setBavNettoVerzicht] = useState([0]);
  const [drvBonus, setDrvBonus] = useState(0);
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [stressTests, setStressTests] = useState<StressTests>({ bearMarket: false, highInflation: false, longevity: false });

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via PDF-Scan (Netto)", icon: Building2, payout: 0, accumulatedLabel: "Beiträge", accumulatedValue: 0 },
    { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: 0 },
    { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
    { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Immobilienwert", accumulatedValue: 0 },
    { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: 0 },
    { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Portfolio", accumulatedValue: 0 }
  ]);

  const handleTutorialNext = () => {
    const nextStep = tutorialStep + 1;
    setTutorialStep(nextStep);
    setActiveView(TUTORIAL_STEPS[nextStep].view);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setActiveView('dashboard');
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAIOnboardingComplete = (data: AIOnboardingData) => {
    setDrvBonus(data.drvBonus);
    setCurrentAge(data.age);
    setMonthlyContribution([data.monthlySavings]);
    setTargetPensionReal([data.targetPension]);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });

    const etfStart = Math.round(data.initialCapital * 0.8);
    const cashStart = data.initialCapital - etfStart;

    const drvPayout = data.pensionAssets.find(a => a.type === 'drv')?.monthlyPayout ?? 0;
    const otherPayout = data.pensionAssets
      .filter(a => a.type !== 'drv')
      .reduce((s, a) => s + a.monthlyPayout, 0);

    let companyAsset: Asset;
    let toastMsg: string;

    if (data.employmentType === 'public') {
      const vblPayout = otherPayout > 0 ? otherPayout : Math.round(drvPayout * 0.12);
      companyAsset = {
        id: "company",
        name: "VBL-Versicherung",
        subtitle: "Pflichtversicherung öffentl. Dienst",
        icon: Briefcase,
        payout: vblPayout,
        accumulatedLabel: "Angespartes Kapital",
        accumulatedValue: vblPayout > 0 ? vblPayout * 120 : 8000,
      };
      toastMsg = "VBL-Pflichtversicherung erkannt & aktiviert";
      setVlActive(false);
    } else if (data.employmentType === 'selfEmployed') {
      companyAsset = {
        id: "company",
        name: "Rürup-Rente",
        subtitle: "Steuerlich gefördert (§ 10 EStG)",
        icon: Briefcase,
        payout: otherPayout,
        accumulatedLabel: "Angespartes Kapital",
        accumulatedValue: otherPayout > 0 ? otherPayout * 120 : 0,
      };
      toastMsg = "Rürup-Rente als Vorsorgeweg eingetragen";
      setVlActive(false);
    } else {
      companyAsset = {
        id: "company",
        name: "Betriebliche Rente",
        subtitle: "bAV & VL verfügbar",
        icon: Briefcase,
        payout: otherPayout,
        accumulatedLabel: "Kapital",
        accumulatedValue: otherPayout > 0 ? 15000 : 0,
      };
      toastMsg = "bAV & VL für dich freigeschaltet";
      setVlActive(true);
    }

    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via KI-Scan (Netto)", icon: Building2, payout: drvPayout, accumulatedLabel: "Beiträge", accumulatedValue: drvPayout * 40 },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: etfStart },
      companyAsset,
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Verkehrswert", accumulatedValue: 0 },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: cashStart },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: 0 }
    ]);
    triggerNotification(toastMsg);
    setTutorialStep(0);
    setActiveView('dashboard');
  };

  const handleLoadPersona = (p: Persona) => {
    setUserName(p.name);
    setCurrentAge(p.age);
    setRetirementAge([p.targetAge]);
    setMonthlyContribution([p.monthlySavings]);
    setTargetPensionReal([p.targetPension]);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });
    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: p.assets.statutoryPayout, accumulatedLabel: "Beiträge", accumulatedValue: p.assets.statutoryAcc },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: p.assets.etfAcc },
      { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: p.assets.companyPayout, accumulatedLabel: "Kapital", accumulatedValue: p.assets.companyAcc },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: p.assets.realestatePayout, accumulatedLabel: "Verkehrswert", accumulatedValue: p.assets.realestateAcc },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: p.assets.cashAcc },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: p.assets.cryptoAcc }
    ]);
    setTutorialStep(0);
    setActiveView('dashboard');
  };

  const handleUpdateAsset = (id: string, payout: number, accumulatedValue: number) => {
    setDynamicAssets(prev => prev.map(asset => {
      if (asset.id === id) return { ...asset, payout, accumulatedValue };
      return asset;
    }));
  };

  const handleDataSync = (payout: number, accumulated: number, type: 'drv' | 'bav') => {
    setDynamicAssets(prev => prev.map(asset => {
      if (type === 'drv' && asset.id === 'statutory') return { ...asset, payout, accumulatedValue: accumulated };
      if (type === 'bav' && asset.id === 'company') return { ...asset, payout, accumulatedValue: accumulated };
      return asset;
    }));
    triggerNotification(`${type === 'drv' ? 'DRV-Rente' : 'bAV'} erfolgreich synchronisiert!`);
    setActiveView('dashboard');
  };

  // --- FINANZMATHEMATIK ---
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
  } = usePensionMath({
    currentAge,
    retirementAge:       retirementAge[0],
    lifeExpectancy:      lifeExpectancy[0],
    monthlyContribution: monthlyContribution[0],
    dynamicSavings,
    expectedReturn:      expectedReturn[0],
    inflation:           inflation[0],
    targetPension:       targetPensionReal[0],
    dynamicAssets,
    vlActive,
    bavBruttoInvest,
    lifeEvents,
    stressTests,
  });

  const activeLifeExpectancy = stressTests.longevity ? 98 : lifeExpectancy[0];

  const statutoryValue   = dynamicAssets.find(a => a.id === 'statutory')?.payout   ?? 0;
  const companyValue     = dynamicAssets.find(a => a.id === 'company')?.payout     ?? 0;
  const realEstatePayout = dynamicAssets.find(a => a.id === 'realestate')?.payout  ?? 0;

  const displayAssets = dynamicAssets.map(asset => {
    if (asset.id === "etf") {
      return {
        ...asset,
        payout: Math.round(additionalMonthlyPayoutNominal),
        accumulatedValue: Math.round(capitalAtRetirement),
        accumulatedLabel: "Endkapital"
      };
    }
    return asset;
  });

  const percentage = Math.round((realPurchasingPowerMonthly / targetPensionReal[0]) * 100);
  const cappedPercentage = Math.min(percentage, 100);
  const ringRadius = 80;
  const ringCircumference = 2 * Math.PI * ringRadius;
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

  const rawSources = [
    { label: "Gesetzl. Rente", value: Math.round(statutoryValue * inflationFactor) },
    { label: "Portfolio",      value: Math.round(additionalMonthlyPayoutNominal * inflationFactor) },
    { label: "Betriebl. Rente", value: Math.round(companyValue * inflationFactor) },
    { label: "Immobilie",      value: Math.round(realEstatePayout * inflationFactor) },
  ].filter(s => s.value > 0).map((s, i) => ({ ...s, color: segmentPalette[i] }));

  const totalChartValue = rawSources.reduce((sum, s) => sum + s.value, 0);
  const filledArc = (cappedPercentage / 100) * ringCircumference;
  const SEGMENT_GAP = 4;

  let _cum = 0;
  const segmentData = rawSources.map((s, i) => {
    const slice = totalChartValue > 0 ? (s.value / totalChartValue) * filledArc : 0;
    const segArc = Math.max(0, slice - SEGMENT_GAP);
    const startArc = _cum;
    _cum += slice;
    const midAngle = ((startArc + slice / 2) / ringCircumference) * 360;
    return { ...s, i, segArc, startArc, side: midAngle < 180 ? 'right' : 'left' as 'left' | 'right' };
  });

  useEffect(() => {
    if (isPositive && !hasShownSuccessToast && activeView === 'dashboard') {
      setNotification("Glückwunsch! Deine Rentenlücke ist geschlossen. 🎯");
      setHasShownSuccessToast(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4500);
      setTimeout(() => setNotification(null), 5500);
    } else if (!isPositive && hasShownSuccessToast) {
      setHasShownSuccessToast(false);
    }
  }, [isPositive, hasShownSuccessToast, activeView]);

  // --- RENDER VIEWS ---

  if (activeView === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col text-white max-w-[430px] mx-auto font-sans relative animate-in fade-in duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: "url('/brad_pit_trade_repbulicctrade_republic.jpg')" }} />
        <div className="absolute inset-0 bg-black/65" />

        {/* TR Unterapp breadcrumb */}
        <div className="relative z-10 flex items-center gap-2 px-6 pt-14 pb-0">
          <img src="/traderepublic_logo.jpg" alt="" className="w-4 h-4 rounded-[3px] object-cover opacity-60" />
          <span className="text-white/45 text-[12px] font-semibold tracking-wide">Trade Republic</span>
          <span className="text-white/25 text-[12px] mx-0.5">·</span>
          <span className="text-white/35 text-[12px]">Altersvorsorge</span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col flex-1 px-6 pt-10 pb-12 justify-center items-center text-center">
          <h1 className="text-4xl font-black text-white mb-1 tracking-tight">FutureMe</h1>
          <p className="text-white/35 text-[12px] font-semibold tracking-widest uppercase mb-7">by Trade Republic</p>

          <p className="text-[15px] text-white/70 leading-relaxed mb-8 px-2">
            Deine Rente. Einfach verstehen, selbst gestalten — in 3 Minuten ein klares Bild.
          </p>

          {/* USPs */}
          <div className="w-full space-y-3 mb-10 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={15} className="text-emerald-400 mt-[1px] shrink-0" />
              <span className="text-white text-[13px] leading-snug font-medium">KI analysiert deinen Rentenbescheid in Sekunden</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={15} className="text-emerald-400 mt-[1px] shrink-0" />
              <span className="text-white/80 text-[13px] leading-snug">Klare Empfehlungen — ohne Fachchinesisch</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={15} className="text-emerald-400 mt-[1px] shrink-0" />
              <span className="text-white/80 text-[13px] leading-snug">Direkt investieren über dein Trade Republic Depot</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <button onClick={() => setActiveView('aionboarding')} className="w-full flex justify-center items-center gap-2 bg-white hover:bg-gray-100 text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer">
              <ArrowRight size={18} /> Jetzt starten
            </button>
            <button onClick={() => setActiveView('onboarding')} className="w-full flex justify-center items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white/70 hover:text-white font-bold text-[13px] py-4 rounded-xl transition-colors cursor-pointer">
              <Users size={18} /> Beispielprofile ansehen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'aionboarding') return <AIOnboarding onComplete={handleAIOnboardingComplete} onSwitchToPersonas={() => setActiveView('welcome')} />;
  if (activeView === 'onboarding') return <Onboarding onSelectPersona={handleLoadPersona} onSwitchToAI={() => setActiveView('welcome')} />;
  if (activeView === 'personalData') return <PersonalDataView onBack={() => setActiveView('profile')} />;
  if (activeView === 'optimize') {
    return (
      <OptimizationPlan
        onBack={() => setActiveView('dashboard')}
        projectedMonthly={realPurchasingPowerMonthly}
        targetPension={targetPensionReal[0]}
        diff={diff}
        monthlyContribution={monthlyContribution[0]}
        setMonthlyContribution={(val) => setMonthlyContribution([val])}
        expectedReturn={expectedReturn[0]}
        setExpectedReturn={(val) => setExpectedReturn([val])}
        retirementAge={retirementAge[0]}
        setRetirementAge={(val) => setRetirementAge([val])}
        vlActive={vlActive}
        setVlActive={setVlActive}
        bavNettoVerzicht={bavNettoVerzicht}
        setBavNettoVerzicht={setBavNettoVerzicht}
        suggestedBavNettoAmount={leverBavNetto}
        drvBonus={drvBonus}
        currentAge={currentAge}
        lifeExpectancy={lifeExpectancy[0]}
        inflation={inflation[0]}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen text-black max-w-[430px] mx-auto font-sans overflow-x-hidden relative">

      {showConfetti && <Confetti />}

      {/* Tutorial overlay — sits above everything except confetti */}
      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={handleTutorialNext}
          onComplete={handleTutorialComplete}
        />
      )}

      {featureTutorialTab && (
        <FeatureTutorial
          tab={featureTutorialTab}
          step={featureTutorialStep}
          total={FEATURE_STEPS[featureTutorialTab]?.length ?? 0}
          onNext={() => setFeatureTutorialStep(prev => prev + 1)}
          onComplete={() => { setFeatureTutorialTab(null); setFeatureTutorialStep(0); }}
        />
      )}

      {/* "?" in header for invest / simulate / profile / chat tabs */}
      {(['invest', 'simulate', 'profile', 'chat'] as const).includes(activeView as any) && !featureTutorialTab && !showTutorial && (
        <button
          onClick={() => { setFeatureTutorialTab(activeView); setFeatureTutorialStep(0); }}
          className="fixed top-[18px] right-5 z-[60] text-gray-400 hover:text-black transition-colors cursor-pointer"
        >
          <HelpCircle size={20} strokeWidth={1.75} />
        </button>
      )}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-white border border-gray-200 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 mt-0.5">
            {notification.includes("Glückwunsch") ? <CheckCircle2 size={16} className="text-black" /> : <Bell size={16} className="text-black" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-black mb-0.5">{notification.includes("Glückwunsch") ? "Ziel erreicht!" : "Information"}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-black cursor-pointer"><X size={14} /></button>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="pb-24">
          <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden">
                <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-[18px] tracking-tight text-black">FutureMe</span>
            </div>
            <div className="flex gap-4 text-gray-400">
              <Bell onClick={() => triggerNotification(`Dein Sparplan über ${monthlyContribution[0]} € wurde erfolgreich ausgeführt.`)} size={20} className="cursor-pointer hover:text-black transition-colors" strokeWidth={1.75} />
              <HelpCircle onClick={() => { setFeatureTutorialTab('dashboard'); setFeatureTutorialStep(0); }} size={20} className="cursor-pointer hover:text-black transition-colors" strokeWidth={1.75} />
              <LogOut onClick={() => setShowLogoutConfirm(true)} size={20} className="cursor-pointer hover:text-red-500 transition-colors" strokeWidth={1.75} />
            </div>
          </div>

          <div className="px-6 pt-8 pb-2 text-center">
            <p className="text-[13px] text-gray-400 font-medium mb-1">Hallo, {userName}</p>
            <h2 className="text-2xl font-black text-black tracking-tight">Deine Rente mit {retirementAge[0]}</h2>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
              So viel Geld hast du im Alter jeden Monat zur Verfügung. <br className="hidden sm:block"/>(Inflation ist bereits abgezogen)
            </p>
          </div>

          <div id="tutorial-dashboard-ring" className="flex items-center justify-center gap-2 py-2 px-4">
            {/* Left labels */}
            <div className="flex flex-col gap-4 w-[86px]">
              {segmentData.filter(s => s.side === 'left').map(s => {
                const isHovered = hoveredSegment === s.i;
                const anyHovered = hoveredSegment !== null;
                return (
                  <div key={s.label}
                    className="text-right cursor-pointer"
                    style={{
                      opacity: anyHovered && !isHovered ? 0.35 : 1,
                      transform: isHovered ? 'scale(1.1)' : anyHovered ? 'scale(0.9)' : 'scale(1)',
                      transformOrigin: 'right center',
                      transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onMouseEnter={() => setHoveredSegment(s.i)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setHoveredSegment(prev => prev === s.i ? null : s.i)}
                  >
                    <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
                    <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
                    <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>{Math.round((s.value / targetPensionReal[0]) * 100)}% vom Ziel</p>
                    <div className="flex justify-end mt-1">
                      <div className="h-[2px] rounded-full transition-all duration-200" style={{ backgroundColor: s.color, width: isHovered ? '36px' : '28px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ring */}
            <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 224 224" className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="112" cy="112" r={ringRadius} stroke="currentColor" strokeWidth="14" fill="transparent" className="text-gray-100" />
                {segmentData.map(s => {
                  const isHovered = hoveredSegment === s.i;
                  const anyHovered = hoveredSegment !== null;
                  return (
                    <circle
                      key={s.label}
                      cx="112" cy="112" r={ringRadius}
                      stroke={s.color}
                      fill="transparent"
                      strokeDasharray={`${s.segArc} ${ringCircumference - s.segArc}`}
                      strokeDashoffset={ringCircumference - s.startArc}
                      strokeLinecap="butt"
                      style={{
                        strokeWidth: isHovered ? 20 : anyHovered ? 11 : 14,
                        opacity: anyHovered && !isHovered ? 0.25 : 1,
                        transition: 'stroke-width 200ms ease, opacity 200ms ease',
                      }}
                      onMouseEnter={() => setHoveredSegment(s.i)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onClick={() => setHoveredSegment(prev => prev === s.i ? null : s.i)}
                      className="cursor-pointer"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none text-center px-3">
                {hoveredSegment !== null && segmentData[hoveredSegment] ? (
                  <>
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-tight transition-all duration-200" style={{ color: segmentData[hoveredSegment].color }}>{segmentData[hoveredSegment].label}</span>
                    <span className="text-[22px] font-black text-black leading-tight mt-0.5">€ {segmentData[hoveredSegment].value.toLocaleString('de-DE')}</span>
                    <span className="text-[10px] mt-0.5 font-semibold" style={{ color: segmentData[hoveredSegment].color }}>{Math.round((segmentData[hoveredSegment].value / targetPensionReal[0]) * 100)}% vom Ziel</span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Mtl. Auszahlung</span>
                    <span className="text-[22px] font-black text-black leading-tight mt-0.5">€ {realPurchasingPowerMonthly.toLocaleString('de-DE')}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Ziel: € {targetPensionReal[0].toLocaleString('de-DE')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right labels */}
            <div className="flex flex-col gap-4 w-[86px]">
              {segmentData.filter(s => s.side === 'right').map(s => {
                const isHovered = hoveredSegment === s.i;
                const anyHovered = hoveredSegment !== null;
                return (
                  <div key={s.label}
                    className="text-left cursor-pointer"
                    style={{
                      opacity: anyHovered && !isHovered ? 0.35 : 1,
                      transform: isHovered ? 'scale(1.1)' : anyHovered ? 'scale(0.9)' : 'scale(1)',
                      transformOrigin: 'left center',
                      transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onMouseEnter={() => setHoveredSegment(s.i)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setHoveredSegment(prev => prev === s.i ? null : s.i)}
                  >
                    <div className="mb-1">
                      <div className="h-[2px] rounded-full transition-all duration-200" style={{ backgroundColor: s.color, width: isHovered ? '36px' : '28px' }} />
                    </div>
                    <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
                    <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
                    <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>{Math.round((s.value / targetPensionReal[0]) * 100)}% vom Ziel</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pb-6">
            <div id="tutorial-dashboard-badge" className={`px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 border ${ringBadgeBg}`}>
              {isPositive ? <CheckCircle2 size={16} /> : <TrendingUp size={16} />}
              {isPositive && percentage > 100
                ? `Ziel erreicht · ${percentage}%`
                : `${percentage}% vom Ziel erreicht`}
            </div>
          </div>

          {!isPositive && (
            <div id="tutorial-dashboard-hebel" className="px-6 pt-2 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Deine 3 größten Hebel</p>
              <div className="space-y-2">
                {([
                  { icon: Landmark, title: "VL-Sparen aktivieren", subtitle: "Arbeitgeberzuschuss", gain: "+40 €/mtl." },
                  { icon: Briefcase, title: "Betriebsrente nutzen", subtitle: "Dein Arbeitgeber zahlt mit", gain: `+${leverBavNetto} €/mtl.` },
                  { icon: TrendingUp, title: "Sparrate erhöhen", subtitle: "Privater Vermögensaufbau", gain: `+${leverSavings} €/mtl.` },
                ] as { icon: React.ElementType; title: string; subtitle: string; gain: string }[]).map(({ icon: Icon, title, subtitle, gain }) => (
                  <div key={title} className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#F4F4F5] rounded-lg flex items-center justify-center shrink-0 self-center">
                      <Icon size={14} className="text-black" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[13px] font-bold text-black leading-tight">{title}</p>
                      <p className="text-[12px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>
                    </div>
                    <p className="text-[13px] font-extrabold text-emerald-500 shrink-0 self-center">{gain}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            <div className="flex justify-between gap-2 border-t border-gray-100 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Reicht bis Alter", value: `${activeLifeExpectancy}+` }, { label: "Sparrate", value: `€ ${monthlyContribution[0]}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-[15px] font-extrabold text-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="tutorial-dashboard-assets">
            <AssetBreakdown assets={displayAssets} onUpdateAsset={handleUpdateAsset} combinedMonthlyNominal={combinedMonthlyNominal} />
          </div>

          <div className="px-6 pt-6 pb-8">
            {isPositive ? (
              <button onClick={() => {}} className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-[15px] py-4 rounded-xl cursor-default">
                Lücke geschlossen!
              </button>
            ) : (
              <button onClick={() => setActiveView('optimize')} className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                <img src="/traderepublic_logo.jpg" alt="" className="w-4 h-4 rounded-[3px] object-cover invert" />
                Mit Trade Republic schließen
              </button>
            )}
          </div>
        </div>
      )}

      {activeView === 'invest' && <div className="pb-24"><InvestView monthlyContribution={monthlyContribution[0]} assets={dynamicAssets} /></div>}
      {activeView === 'simulate' && <div className="pb-24"><SimulateView currentAge={currentAge} retirementAge={retirementAge[0]} lifeEvents={lifeEvents} setLifeEvents={setLifeEvents} stressTests={stressTests} setStressTests={setStressTests} /></div>}

      {activeView === 'profile' && (
        <div className="pb-24">
          <ProfileView
            inflation={inflation} setInflation={setInflation}
            retirementAge={retirementAge} setRetirementAge={setRetirementAge}
            monthlyContribution={monthlyContribution} setMonthlyContribution={setMonthlyContribution}
            expectedReturn={expectedReturn} setExpectedReturn={setExpectedReturn}
            lifeExpectancy={lifeExpectancy} setLifeExpectancy={setLifeExpectancy}
            targetPension={targetPensionReal} setTargetPension={setTargetPensionReal}
            dynamicSavings={dynamicSavings} setDynamicSavings={setDynamicSavings}
            projectedMonthly={realPurchasingPowerMonthly} diff={diff} isPositive={isPositive} yearsLeft={retirementAge[0] - currentAge}
            onNavigateToPersonalData={() => setActiveView('personalData')}
            onSyncComplete={handleDataSync}
            vlActive={vlActive}
            bavNetto={bavNettoVerzicht[0]}
          />
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-7 pb-10 animate-in slide-in-from-bottom-4 duration-300 max-w-[430px] mx-auto w-full">
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
            <h3 className="text-[20px] font-black text-black mb-2">Fortschritt geht verloren.</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
              Du hast noch keinen Account — wenn du jetzt zurückgehst, sind alle eingegebenen Daten weg.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-black text-white font-extrabold text-[15px] py-4 rounded-xl cursor-pointer"
              >
                Weitermachen
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); setActiveView('welcome'); }}
                className="w-full bg-[#F4F4F5] text-gray-500 font-bold text-[15px] py-4 rounded-xl cursor-pointer"
              >
                Trotzdem abmelden
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-40 max-w-[430px] mx-auto flex flex-col bg-white"
        style={{ display: activeView === 'chat' ? 'flex' : 'none' }}
      >
        <GuidedSmartChat
          key={chatResetKey}
          monthlyContribution={monthlyContribution[0]}
          setMonthlyContribution={(val) => setMonthlyContribution([val])}
          retirementAge={retirementAge[0]}
          setRetirementAge={(val) => setRetirementAge([val])}
          lifeEvents={lifeEvents}
          setLifeEvents={setLifeEvents}
          stressTests={stressTests}
          setStressTests={setStressTests}
          onReset={() => setChatResetKey(k => k + 1)}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 pt-2.5 flex justify-around items-center" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        {([
          { id: "dashboard", label: "Übersicht", icon: LayoutDashboard, finn: false },
          { id: "invest",    label: "Invest",     icon: TrendingUp,      finn: false },
          { id: "chat",      label: "Finn",       icon: MessageCircle,   finn: true  },
          { id: "simulate",  label: "Simulation", icon: Sliders,         finn: false },
          { id: "profile",   label: "Profil",     icon: User,            finn: false },
        ] as { id: string; label: string; icon: React.ElementType; finn: boolean }[]).map(({ id, label, icon: Icon, finn }, idx, arr) => {
          const hovIdx = arr.findIndex(t => t.id === hoveredTab);
          const dist = hovIdx === -1 ? 99 : Math.abs(idx - hovIdx);
          const scale = dist === 0 ? 1.22 : 1;
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => handleTabNav(id)}
              onMouseEnter={() => setHoveredTab(id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{ transform: `scale(${scale})`, transition: 'transform 180ms cubic-bezier(0.34,1.56,0.64,1)' }}
              className="relative flex flex-col items-center gap-1 min-w-[48px] py-1 cursor-pointer origin-bottom"
            >
              {finn ? (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-black' : 'bg-black/80'}`}>
                  <Icon size={17} className="text-white" strokeWidth={isActive ? 2.5 : 2} />
                </div>
              ) : (
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.75} className={isActive ? 'text-black' : 'text-gray-400'} />
              )}
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
