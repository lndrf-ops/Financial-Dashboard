import { useState, useEffect } from 'react';
import { Building2, TrendingUp, Briefcase, Home, Landmark, Bitcoin, Wallet } from 'lucide-react';
import { Asset } from '../components/custom/AssetBreakdown';
import { AIOnboardingData } from '../components/custom/AIOnboarding';
import { Persona } from '../components/custom/Onboarding';
import { LifeEvent, StressTests } from '../components/custom/SimulateView';

export type AppView =
  | 'welcome' | 'aionboarding' | 'onboarding' | 'dashboard'
  | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData' | 'chat';

const DEFAULT_ASSETS: Asset[] = [
  { id: "statutory",  name: "Gesetzliche Rente",       subtitle: "Via PDF-Scan (Netto)",          icon: Building2, payout: 0, accumulatedLabel: "Beiträge",          accumulatedValue: 0 },
  { id: "etf",        name: "Weltweites Portfolio",     subtitle: "Privater Vermögensaufbau",      icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert",  accumulatedValue: 0 },
  { id: "company",    name: "Betriebliche Rente",       subtitle: "Entgeltumwandlung",             icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital",accumulatedValue: 0 },
  { id: "realestate", name: "Immobilie",                subtitle: "Eigenheim / Vermietung",        icon: Home,      payout: 0, accumulatedLabel: "Immobilienwert",     accumulatedValue: 0 },
  { id: "cash",       name: "Tagesgeld",                subtitle: "Sichere Liquidität",            icon: Landmark,  payout: 0, accumulatedLabel: "Start-Guthaben",     accumulatedValue: 0 },
  { id: "crypto",     name: "Kryptowährungen",          subtitle: "Bitcoin & Altcoins",            icon: Bitcoin,   payout: 0, accumulatedLabel: "Portfolio",          accumulatedValue: 0 },
  { id: "avd",        name: "Altersvorsorgedepot",      subtitle: "Staatl. gefördert (ab 2027)",   icon: Wallet,    payout: 0, accumulatedLabel: "Depotwert",          accumulatedValue: 0, locked: new Date() < new Date('2027-01-01') },
];

export function useAppState() {
  const [activeView, setActiveView] = useState<AppView>('welcome');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [chatResetKey, setChatResetKey] = useState(0);

  // User / pension params
  const [userName, setUserName] = useState('Lena');
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
  const [drvBonus, setDrvBonus] = useState(false);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [stressTests, setStressTests] = useState<StressTests>({ bearMarket: false, highInflation: false, longevity: false });
  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>(DEFAULT_ASSETS);
  const [avdActive, setAvdActive] = useState(false);
  const [avdMonthlyContribution, setAvdMonthlyContribution] = useState([50]);

  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 1.9);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAIOnboardingComplete = (data: AIOnboardingData) => {
    setUserName('Lena');
    setDrvBonus(data.drvBonusFound);
    setCurrentAge(data.age);
    setRetirementAge([67]);
    setMonthlyContribution([data.monthlySavings]);
    setTargetPensionReal([data.targetPension]);
    const returnRate = data.employmentType === 'public' ? 5.5 : data.employmentType === 'selfEmployed' ? 6.5 : 7.0;
    setExpectedReturn([returnRate]);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });

    const etfStart  = Math.round(data.initialCapital * 0.8);
    const cashStart = data.initialCapital - etfStart;
    const drvPayout = data.pensionAssets.find(a => a.type === 'drv')?.monthlyPayout ?? 0;
    const bavPayout = data.pensionAssets.filter(a => a.type === 'bAV').reduce((s, a) => s + a.monthlyPayout, 0);
    const hasRiester = data.pensionAssets.some(a => a.type === 'riester');
    const otherPayout = data.pensionAssets.filter(a => a.type !== 'drv').reduce((s, a) => s + a.monthlyPayout, 0);

    let companyAsset: Asset;

    if (data.employmentType === 'public') {
      const vblPayout = otherPayout > 0 ? otherPayout : Math.round(drvPayout * 0.12);
      companyAsset = { id: "company", name: "VBL-Versicherung", subtitle: "Pflichtversicherung öffentl. Dienst", icon: Briefcase, payout: vblPayout, accumulatedLabel: "Angespartes Kapital", accumulatedValue: vblPayout > 0 ? vblPayout * 120 : 8000 };
      setVlActive(false);
    } else if (data.employmentType === 'selfEmployed') {
      companyAsset = { id: "company", name: "Rürup-Rente", subtitle: "Steuerlich gefördert (§ 10 EStG)", icon: Briefcase, payout: otherPayout, accumulatedLabel: "Angespartes Kapital", accumulatedValue: otherPayout > 0 ? otherPayout * 120 : 0 };
      setVlActive(false);
    } else {
      const companyName = bavPayout > 0 && hasRiester ? "bAV & Riester"
        : bavPayout > 0 ? "Betriebliche Rente"
        : hasRiester ? "Riester-Rente"
        : "Betriebliche Rente";
      const companySubtitle = bavPayout > 0 && hasRiester ? "Entgeltumwandlung & Riester-Vertrag"
        : bavPayout > 0 ? "Entgeltumwandlung"
        : hasRiester ? "Staatl. geförderter Sparplan"
        : "bAV & VL verfügbar";
      companyAsset = { id: "company", name: companyName, subtitle: companySubtitle, icon: Briefcase, payout: otherPayout, accumulatedLabel: "Kapital", accumulatedValue: bavPayout > 0 ? Math.round(bavPayout * 80) : 0 };
      setVlActive(false);
    }

    setDynamicAssets([
      { id: "statutory",  name: "Gesetzliche Rente",  subtitle: "Via KI-Scan (Netto)",       icon: Building2,  payout: drvPayout, accumulatedLabel: "Beiträge",      accumulatedValue: drvPayout * 40 },
      { id: "etf",        name: "Weltweites Portfolio",subtitle: "Privater Vermögensaufbau",  icon: TrendingUp, payout: 0,         accumulatedLabel: "Start-Depotwert",accumulatedValue: etfStart },
      companyAsset,
      { id: "realestate", name: "Immobilie",           subtitle: "Eigenheim / Vermietung",   icon: Home,       payout: 0,         accumulatedLabel: "Verkehrswert",   accumulatedValue: 0 },
      { id: "cash",       name: "Tagesgeld",           subtitle: "Sichere Liquidität",        icon: Landmark,   payout: 0,         accumulatedLabel: "Start-Guthaben", accumulatedValue: cashStart },
      { id: "crypto",     name: "Kryptowährungen",     subtitle: "Bitcoin & Altcoins",        icon: Bitcoin,    payout: 0,         accumulatedLabel: "Wallet",         accumulatedValue: 0 },
      { id: "avd",        name: "Altersvorsorgedepot", subtitle: "Staatl. gefördert (ab 2027)", icon: Wallet,  payout: 0,         accumulatedLabel: "Depotwert",      accumulatedValue: 0 },
    ]);
    if (data.feeling === 'worried') {
      triggerNotification('Keine Sorge — wir haben deinen persönlichen Plan berechnet.');
    } else if (data.feeling === 'relaxed') {
      triggerNotification('Super Einstellung! Hier ist dein persönlicher Rentenplan.');
    }
    setActiveView('dashboard');
  };

  const handleLoadPersona = (p: Persona) => {
    setUserName(p.name);
    setCurrentAge(p.age);
    setRetirementAge([p.targetAge]);
    setMonthlyContribution([p.monthlySavings]);
    setTargetPensionReal([p.targetPension]);
    setVlActive(false);
    setBavNettoVerzicht([0]);
    setAvdActive(false);
    setHasShownSuccessToast(false);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });
    setDynamicAssets([
      { id: "statutory",  name: "Gesetzliche Rente",    subtitle: "Deutsche Rentenversicherung",   icon: Building2,  payout: p.assets.statutoryPayout, accumulatedLabel: "Beiträge",      accumulatedValue: p.assets.statutoryAcc },
      { id: "etf",        name: "Weltweites Portfolio",  subtitle: "Privater Vermögensaufbau",     icon: TrendingUp, payout: 0,                         accumulatedLabel: "Start-Depotwert",accumulatedValue: p.assets.etfAcc },
      { id: "company",    name: "Betriebliche Rente",    subtitle: "Entgeltumwandlung",            icon: Briefcase,  payout: p.assets.companyPayout,    accumulatedLabel: "Kapital",       accumulatedValue: p.assets.companyAcc },
      { id: "realestate", name: "Immobilie",             subtitle: "Eigenheim / Vermietung",       icon: Home,       payout: p.assets.realestatePayout, accumulatedLabel: "Verkehrswert",  accumulatedValue: p.assets.realestateAcc },
      { id: "cash",       name: "Tagesgeld",             subtitle: "Sichere Liquidität",           icon: Landmark,   payout: 0,                         accumulatedLabel: "Start-Guthaben",accumulatedValue: p.assets.cashAcc },
      { id: "crypto",     name: "Kryptowährungen",       subtitle: "Bitcoin & Altcoins",           icon: Bitcoin,    payout: 0,                         accumulatedLabel: "Wallet",        accumulatedValue: p.assets.cryptoAcc },
      { id: "avd",        name: "Altersvorsorgedepot",   subtitle: "Staatl. gefördert (ab 2027)", icon: Wallet,     payout: 0,                         accumulatedLabel: "Depotwert",     accumulatedValue: 0 },
    ]);
    setActiveView('dashboard');
  };

  const handleUpdateAsset = (id: string, payout: number, accumulatedValue: number) => {
    setDynamicAssets(prev => prev.map(a => a.id === id ? { ...a, payout, accumulatedValue } : a));
  };

  const handleDataSync = (assets: Array<{ assetId: string; payout: number; accumulated: number }>) => {
    setDynamicAssets(prev => prev.map(a => {
      const update = assets.find(u => u.assetId === a.id);
      return update ? { ...a, payout: update.payout, accumulatedValue: update.accumulated } : a;
    }));
    // If a bAV asset is synced with real data, the user is employed — activate VL/bAV features.
    if (assets.some(u => u.assetId === 'company' && u.payout > 0)) {
      setVlActive(true);
    }
    triggerNotification(`${assets.length} Vorsorgequellen synchronisiert!`);
    setActiveView('dashboard');
  };

  return {
    activeView, setActiveView,
    notification, setNotification,
    showConfetti, setShowConfetti,
    hasShownSuccessToast, setHasShownSuccessToast,
    showLogoutConfirm, setShowLogoutConfirm,
    chatResetKey, setChatResetKey,
    userName,
    currentAge,
    inflation, setInflation,
    retirementAge, setRetirementAge,
    lifeExpectancy, setLifeExpectancy,
    monthlyContribution, setMonthlyContribution,
    dynamicSavings, setDynamicSavings,
    expectedReturn, setExpectedReturn,
    targetPensionReal, setTargetPensionReal,
    vlActive, setVlActive,
    bavNettoVerzicht, setBavNettoVerzicht,
    bavBruttoInvest,
    drvBonus,
    lifeEvents, setLifeEvents,
    stressTests, setStressTests,
    dynamicAssets,
    avdActive, setAvdActive,
    avdMonthlyContribution, setAvdMonthlyContribution,
    triggerNotification,
    handleAIOnboardingComplete,
    handleLoadPersona,
    handleUpdateAsset,
    handleDataSync,
  };
}
