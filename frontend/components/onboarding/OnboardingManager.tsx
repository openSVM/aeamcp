'use client';

import React, { useState, useEffect } from 'react';
import { useOnboarding } from './OnboardingContext';
import { UserType } from './types';
import UserTypeSelector from './UserTypeSelector';
import TourEngine from './TourEngine';

interface OnboardingManagerProps {
  autoStart?: boolean;
  showOnFirstVisit?: boolean;
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({
  autoStart = true,
  showOnFirstVisit = true,
}) => {
  const { state, startTour, setUserType, trackInteraction } = useOnboarding();
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  const [hasShownOnboarding, setHasShownOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has seen onboarding before - only run on client
  useEffect(() => {
    if (!isClient) return;
    
    const hasSeenOnboarding = localStorage.getItem('onboarding-seen');
    const shouldShow = showOnFirstVisit && !hasSeenOnboarding && autoStart;
    
    if (shouldShow) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShowUserTypeSelector(true);
        setHasShownOnboarding(true);
        localStorage.setItem('onboarding-seen', 'true');
      }, 1000);
    }
  }, [autoStart, showOnFirstVisit, isClient]);

  const handleUserTypeSelection = (userType: UserType) => {
    setUserType(userType);
    setShowUserTypeSelector(false);
    
    // Track user type selection
    trackInteraction('user_type_selected', { userType });
    
    // Start the appropriate tour
    const tourId = `${userType}-onboarding`;
    startTour(tourId, userType);
  };

  const handleTourComplete = (tourId: string) => {
    trackInteraction('onboarding_completed', { tourId });
    
    // Show completion message or redirect
    // This could be customized based on user type
    console.log(`Tour ${tourId} completed!`);
  };

  const handleTourSkip = (step: number) => {
    trackInteraction('onboarding_step_skipped', { step });
  };

  const handleCloseUserTypeSelector = () => {
    setShowUserTypeSelector(false);
    trackInteraction('onboarding_dismissed', { reason: 'user_closed_selector' });
  };

  // Public method to manually start onboarding
  const startOnboarding = () => {
    setShowUserTypeSelector(true);
    trackInteraction('onboarding_manually_started', {});
  };

  // Expose startOnboarding method globally for other components to use
  useEffect(() => {
    (window as any).startOnboarding = startOnboarding;
    
    return () => {
      delete (window as any).startOnboarding;
    };
  }, []);

  return (
    <>
      {/* User Type Selector Modal */}
      {showUserTypeSelector && (
        <UserTypeSelector
          onSelectUserType={handleUserTypeSelection}
          onClose={handleCloseUserTypeSelector}
        />
      )}

      {/* Tour Engine */}
      {state.isActive && state.currentTour && state.userType && (
        <TourEngine
          tourId={state.currentTour}
          userType={state.userType}
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
    </>
  );
};

export default OnboardingManager;