'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { OnboardingState, OnboardingAction, UserType, OnboardingPreferences } from './types';

const initialPreferences: OnboardingPreferences = {
  autoStart: true,
  showHints: true,
  animationSpeed: 'normal',
  skipCompleted: true,
  language: 'en',
};

const initialState: OnboardingState = {
  isActive: false,
  currentTour: null,
  currentStep: 0,
  userType: null,
  completedTours: [],
  skippedSteps: [],
  startTime: null,
  preferences: initialPreferences,
  analytics: {
    tourStarted: null,
    stepTimes: {},
    totalTimeSpent: 0,
    interactionCount: 0,
    completionRate: 0,
  },
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'START_TOUR':
      return {
        ...state,
        isActive: true,
        currentTour: action.payload.tourId,
        userType: action.payload.userType,
        currentStep: 0,
        startTime: new Date(),
        skippedSteps: [],
        analytics: {
          ...state.analytics,
          tourStarted: new Date(),
          stepTimes: {},
          interactionCount: 0,
        },
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
        analytics: {
          ...state.analytics,
          interactionCount: state.analytics.interactionCount + 1,
        },
      };

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };

    case 'SKIP_STEP':
      return {
        ...state,
        skippedSteps: [...state.skippedSteps, action.payload.stepId],
        currentStep: state.currentStep + 1,
      };

    case 'COMPLETE_TOUR':
      const completedTours = state.currentTour 
        ? [...state.completedTours, state.currentTour]
        : state.completedTours;
      
      return {
        ...state,
        isActive: false,
        currentTour: null,
        currentStep: 0,
        completedTours,
        analytics: {
          ...state.analytics,
          completionRate: 100,
          totalTimeSpent: state.startTime 
            ? Date.now() - state.startTime.getTime()
            : 0,
        },
      };

    case 'ABANDON_TOUR':
      return {
        ...state,
        isActive: false,
        currentTour: null,
        currentStep: 0,
        analytics: {
          ...state.analytics,
          totalTimeSpent: state.startTime 
            ? Date.now() - state.startTime.getTime()
            : 0,
        },
      };

    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.payload.userType,
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case 'TRACK_INTERACTION':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          interactionCount: state.analytics.interactionCount + 1,
        },
      };

    default:
      return state;
  }
}

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  startTour: (tourId: string, userType: UserType) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: (stepId: string) => void;
  completeTour: () => void;
  abandonTour: (reason: string) => void;
  setUserType: (userType: UserType) => void;
  updatePreferences: (preferences: Partial<OnboardingPreferences>) => void;
  trackInteraction: (action: string, context: any) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('onboarding-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: parsed.preferences });
        // Restore completed tours
        parsed.completedTours?.forEach((tourId: string) => {
          // Note: We don't restore active tours, only completed ones
        });
      } catch (error) {
        console.warn('Failed to load onboarding state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      completedTours: state.completedTours,
      preferences: state.preferences,
      analytics: state.analytics,
    };
    localStorage.setItem('onboarding-state', JSON.stringify(stateToSave));
  }, [state.completedTours, state.preferences, state.analytics]);

  const contextValue: OnboardingContextType = {
    state,
    dispatch,
    startTour: (tourId: string, userType: UserType) => {
      dispatch({ type: 'START_TOUR', payload: { tourId, userType } });
    },
    nextStep: () => {
      dispatch({ type: 'NEXT_STEP' });
    },
    previousStep: () => {
      dispatch({ type: 'PREVIOUS_STEP' });
    },
    skipStep: (stepId: string) => {
      dispatch({ type: 'SKIP_STEP', payload: { stepId } });
    },
    completeTour: () => {
      dispatch({ type: 'COMPLETE_TOUR' });
    },
    abandonTour: (reason: string) => {
      dispatch({ type: 'ABANDON_TOUR', payload: { reason } });
    },
    setUserType: (userType: UserType) => {
      dispatch({ type: 'SET_USER_TYPE', payload: { userType } });
    },
    updatePreferences: (preferences: Partial<OnboardingPreferences>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },
    trackInteraction: (action: string, context: any) => {
      dispatch({ type: 'TRACK_INTERACTION', payload: { action, context } });
    },
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export { OnboardingContext };