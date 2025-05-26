'use client';

import React from 'react';
import { ProgressState } from './types';

interface ProgressTrackerProps {
  progress: ProgressState;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
  isPaused?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  onSkip,
  onPause,
  onResume,
  isPaused = false,
}) => {
  const completionPercentage = (progress.currentStep / progress.totalSteps) * 100;
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEstimatedTimeRemaining = (): string => {
    if (progress.estimatedTimeRemaining <= 0) return '0:00';
    return formatTime(Math.ceil(progress.estimatedTimeRemaining));
  };

  const getElapsedTime = (): string => {
    const elapsed = Math.floor((Date.now() - progress.startTime.getTime()) / 1000);
    return formatTime(elapsed);
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 bg-white border-2 border-black p-4 shadow-lg"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        boxShadow: '4px 4px 0px #A3A3A3',
        minWidth: '280px',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold">ONBOARDING PROGRESS</h3>
        <div className="flex gap-2">
          <button
            onClick={isPaused ? onResume : onPause}
            className="text-xs px-2 py-1 border border-gray-400 hover:bg-gray-100"
            title={isPaused ? 'Resume tour' : 'Pause tour'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <button
            onClick={onSkip}
            className="text-xs px-2 py-1 border border-gray-400 hover:bg-gray-100"
            title="Skip tour"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Step {progress.currentStep} of {progress.totalSteps}</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 border border-gray-400 h-3">
          <div
            className="bg-black h-full transition-all duration-300 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-3">
        {Array.from({ length: progress.totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = progress.completedSteps.includes(stepNumber);
          const isCurrent = stepNumber === progress.currentStep;
          
          return (
            <div
              key={stepNumber}
              className={`w-6 h-6 border-2 flex items-center justify-center text-xs font-bold ${
                isCompleted
                  ? 'bg-black text-white border-black'
                  : isCurrent
                  ? 'bg-yellow-300 border-black'
                  : 'bg-white border-gray-400'
              }`}
              title={`Step ${stepNumber}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
          );
        })}
      </div>

      {/* Time Information */}
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Elapsed:</span>
          <span className="font-mono">{getElapsedTime()}</span>
        </div>
        <div className="flex justify-between">
          <span>Remaining:</span>
          <span className="font-mono">{getEstimatedTimeRemaining()}</span>
        </div>
      </div>

      {/* Tour Information */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="text-xs">
          <div className="font-bold mb-1">TOUR: {progress.tourId.toUpperCase()}</div>
          {isPaused && (
            <div className="text-yellow-600 font-bold">⏸ PAUSED</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="flex-1 text-xs px-2 py-1 border-2 border-gray-400 bg-white hover:bg-gray-100"
          >
            [SKIP TOUR]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;