import { useState, useEffect } from 'react';
import { FEATURE_STEPS } from '../components/tutorial/featureSteps';

type AppView = string;

export function useFeatureTutorial(activeView: AppView) {
  const [featureTutorialTab, setFeatureTutorialTab] = useState<string | null>(null);
  const [featureTutorialStep, setFeatureTutorialStep] = useState(0);
  const [seenTabTutorials, setSeenTabTutorials] = useState<Set<string>>(new Set());

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

  const handleTabNav = (id: string, setActiveView: (v: any) => void) => {
    setActiveView(id);
    if (!seenTabTutorials.has(id) && FEATURE_STEPS[id]) {
      setTimeout(() => {
        setFeatureTutorialTab(id);
        setFeatureTutorialStep(0);
        setSeenTabTutorials(prev => new Set([...prev, id]));
      }, 350);
    }
  };

  const nextStep = () => setFeatureTutorialStep(prev => prev + 1);

  const complete = () => {
    setFeatureTutorialTab(null);
    setFeatureTutorialStep(0);
  };

  const open = (tab: string) => {
    setFeatureTutorialTab(tab);
    setFeatureTutorialStep(0);
  };

  return {
    featureTutorialTab,
    featureTutorialStep,
    handleTabNav,
    nextStep,
    complete,
    open,
  };
}
