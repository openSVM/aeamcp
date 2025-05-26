// Main exports for the onboarding system
export { OnboardingProvider, useOnboarding } from './OnboardingContext';
export { default as OnboardingManager } from './OnboardingManager';
export { default as TourEngine } from './TourEngine';
export { default as UserTypeSelector } from './UserTypeSelector';
export { default as Tooltip } from './Tooltip';
export { default as Hotspot } from './Hotspot';
export { default as ProgressTracker } from './ProgressTracker';
export { getTourConfig, tourConfigs } from './tourConfigs';
export * from './types';

// Convenience hook for starting onboarding from anywhere
export const useOnboardingTrigger = () => {
  return {
    startOnboarding: () => {
      if (typeof window !== 'undefined' && (window as any).startOnboarding) {
        (window as any).startOnboarding();
      }
    }
  };
};