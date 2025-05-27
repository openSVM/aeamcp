'use client';

import React, { useEffect, useState } from 'react';
import { useOnboarding } from './OnboardingContext';
import { getTourConfig } from './tourConfigs';
import { TourConfig, TourStep, UserType } from './types';
import Hotspot from './Hotspot';
import Tooltip from './Tooltip';
import ProgressTracker from './ProgressTracker';

interface TourEngineProps {
  tourId: string;
  userType: UserType;
  onComplete: (tourId: string) => void;
  onSkip: (step: number) => void;
}

export const TourEngine: React.FC<TourEngineProps> = ({
  tourId,
  userType,
  onComplete,
  onSkip,
}) => {
  const { state, nextStep, previousStep, skipStep, completeTour, abandonTour, trackInteraction } = useOnboarding();
  const [tourConfig, setTourConfig] = useState<TourConfig | null>(null);
  const [currentStepData, setCurrentStepData] = useState<TourStep | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Load tour configuration
  useEffect(() => {
    const config = getTourConfig(userType);
    if (config && config.id === tourId) {
      setTourConfig(config);
    }
  }, [tourId, userType]);

  // Update current step data
  useEffect(() => {
    if (tourConfig && state.currentStep < tourConfig.steps.length) {
      const stepData = tourConfig.steps[state.currentStep];
      setCurrentStepData(stepData);
      
      // Find target element
      const element = document.querySelector(stepData.target) as HTMLElement;
      setTargetElement(element);
      
      // Show tooltip after a brief delay for better UX
      setTimeout(() => setShowTooltip(true), 300);
    } else if (tourConfig && state.currentStep >= tourConfig.steps.length) {
      // Tour completed
      handleTourComplete();
    }
  }, [state.currentStep, tourConfig]);

  // Handle step progression based on action type
  useEffect(() => {
    if (!currentStepData || isPaused) return;

    if (currentStepData.action === 'auto') {
      const timer = setTimeout(() => {
        handleNextStep();
      }, currentStepData.duration ? currentStepData.duration * 1000 : 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStepData, isPaused]);

  const handleNextStep = () => {
    if (!tourConfig || !currentStepData) return;

    // Track step completion
    trackInteraction('step_completed', {
      tourId,
      stepId: currentStepData.id,
      stepNumber: state.currentStep + 1,
    });

    // Check if validation is required
    if (currentStepData.validation && !currentStepData.validation()) {
      return; // Don't proceed if validation fails
    }

    setShowTooltip(false);
    
    // Brief delay before moving to next step for better UX
    setTimeout(() => {
      if (state.currentStep < tourConfig.steps.length - 1) {
        nextStep();
      } else {
        handleTourComplete();
      }
    }, 200);
  };

  const handlePreviousStep = () => {
    if (state.currentStep > 0) {
      setShowTooltip(false);
      setTimeout(() => {
        previousStep();
      }, 200);
    }
  };

  const handleSkipStep = () => {
    if (!currentStepData) return;
    
    trackInteraction('step_skipped', {
      tourId,
      stepId: currentStepData.id,
      stepNumber: state.currentStep + 1,
    });

    skipStep(currentStepData.id);
    onSkip(state.currentStep);
  };

  const handleTourComplete = () => {
    trackInteraction('tour_completed', {
      tourId,
      totalSteps: tourConfig?.steps.length || 0,
      skippedSteps: state.skippedSteps.length,
    });

    completeTour();
    onComplete(tourId);
  };

  const handleTourAbandon = (reason: string) => {
    trackInteraction('tour_abandoned', {
      tourId,
      stepId: currentStepData?.id,
      reason,
    });

    abandonTour(reason);
  };

  const handleHotspotAction = () => {
    if (!currentStepData) return;

    trackInteraction('hotspot_clicked', {
      tourId,
      stepId: currentStepData.id,
      target: currentStepData.target,
    });

    if (currentStepData.nextCondition === 'manual') {
      // Wait for user to click next in tooltip
      return;
    } else {
      handleNextStep();
    }
  };

  const getProgressState = () => {
    if (!tourConfig) return null;

    return {
      tourId,
      currentStep: state.currentStep + 1,
      totalSteps: tourConfig.steps.length,
      completedSteps: Array.from({ length: state.currentStep }, (_, i) => i + 1),
      startTime: state.startTime || new Date(),
      estimatedTimeRemaining: Math.max(0, tourConfig.estimatedDuration - (state.analytics.totalTimeSpent / 1000)),
    };
  };

  // Don't render if tour is not active or config is not loaded
  if (!state.isActive || !tourConfig || !currentStepData || !targetElement) {
    return null;
  }

  const progressState = getProgressState();

  return (
    <>
      {/* Progress Tracker */}
      {progressState && (
        <ProgressTracker
          progress={progressState}
          onSkip={() => handleTourAbandon('user_skipped')}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
          isPaused={isPaused}
        />
      )}

      {/* Hotspot */}
      {!isPaused && (
        <Hotspot
          target={currentStepData.target}
          position={currentStepData.position}
          content={currentStepData.content}
          action={currentStepData.action}
          onAction={handleHotspotAction}
          isActive={true}
        />
      )}

      {/* Tooltip */}
      {showTooltip && !isPaused && (
        <Tooltip
          content={currentStepData.content}
          position={currentStepData.position}
          target={targetElement}
          onClose={() => handleTourAbandon('user_closed')}
          onNext={currentStepData.nextCondition === 'manual' ? handleNextStep : undefined}
          onPrevious={state.currentStep > 0 ? handlePreviousStep : undefined}
          showNavigation={true}
          step={state.currentStep + 1}
          totalSteps={tourConfig.steps.length}
        />
      )}

      {/* Global styles for tour animations */}
      <style jsx global>{`
        @keyframes onboarding-pulse {
          0% {
            border-color: #FFD700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
          50% {
            border-color: #FFA500;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
          }
          100% {
            border-color: #FFD700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes onboarding-click-pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes onboarding-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .onboarding-tooltip {
          animation: onboarding-fade-in 0.3s ease-out;
        }

        .onboarding-hotspot {
          animation: onboarding-pulse 2s infinite;
        }

        /* Ensure tour elements are above everything else */
        .onboarding-overlay {
          z-index: 9999;
        }
      `}</style>
    </>
  );
};

export default TourEngine;