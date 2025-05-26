export type UserType = 'developer' | 'enduser' | 'provider';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type InteractionType = 'click' | 'hover' | 'scroll' | 'auto';

export type NextCondition = 'auto' | 'manual' | 'validation';

export interface TourStep {
  id: string;
  title: string;
  content: string | React.ReactNode;
  target: string; // CSS selector
  position: TooltipPosition;
  action: InteractionType;
  validation?: () => boolean;
  nextCondition: NextCondition;
  duration?: number; // in seconds
  analytics?: {
    trackClicks?: boolean;
    trackTime?: boolean;
    customEvents?: string[];
  };
  expandableSections?: {
    [sectionId: string]: {
      title: string;
      content: string;
    };
  };
}

export interface TourConfig {
  id: string;
  userType: UserType;
  title: string;
  description: string;
  estimatedDuration: number; // in seconds
  steps: TourStep[];
  prerequisites?: string[];
  completionRewards?: string[];
}

export interface OnboardingState {
  isActive: boolean;
  currentTour: string | null;
  currentStep: number;
  userType: UserType | null;
  completedTours: string[];
  skippedSteps: string[];
  startTime: Date | null;
  preferences: OnboardingPreferences;
  analytics: OnboardingAnalytics;
}

export interface OnboardingPreferences {
  autoStart: boolean;
  showHints: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  skipCompleted: boolean;
  language: string;
}

export interface OnboardingAnalytics {
  tourStarted: Date | null;
  stepTimes: Record<string, number>;
  totalTimeSpent: number;
  interactionCount: number;
  completionRate: number;
}

export interface ProgressState {
  tourId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  startTime: Date;
  estimatedTimeRemaining: number;
}

export type OnboardingAction =
  | { type: 'START_TOUR'; payload: { tourId: string; userType: UserType } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SKIP_STEP'; payload: { stepId: string } }
  | { type: 'COMPLETE_TOUR' }
  | { type: 'ABANDON_TOUR'; payload: { reason: string } }
  | { type: 'SET_USER_TYPE'; payload: { userType: UserType } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<OnboardingPreferences> }
  | { type: 'TRACK_INTERACTION'; payload: { action: string; context: any } };

export interface HotspotProps {
  target: string;
  position: TooltipPosition;
  content: React.ReactNode;
  action?: InteractionType;
  onAction: () => void;
  isActive: boolean;
  className?: string;
}

export interface TooltipProps {
  content: React.ReactNode;
  position: TooltipPosition;
  target: HTMLElement;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  step?: number;
  totalSteps?: number;
}