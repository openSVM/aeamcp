'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TooltipProps, TooltipPosition } from './types';

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position,
  target,
  onClose,
  onNext,
  onPrevious,
  showNavigation = true,
  step,
  totalSteps,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (!target || !tooltipRef.current) return;

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let top = 0;
      let left = 0;
      let finalPosition = position;

      // Calculate initial position
      switch (position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 16;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 16;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - 16;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + 16;
          break;
        case 'center':
          top = (viewport.height - tooltipRect.height) / 2;
          left = (viewport.width - tooltipRect.width) / 2;
          break;
      }

      // Adjust if tooltip goes outside viewport
      if (left < 16) {
        left = 16;
        if (position === 'left') finalPosition = 'right';
      }
      if (left + tooltipRect.width > viewport.width - 16) {
        left = viewport.width - tooltipRect.width - 16;
        if (position === 'right') finalPosition = 'left';
      }
      if (top < 16) {
        top = 16;
        if (position === 'top') finalPosition = 'bottom';
      }
      if (top + tooltipRect.height > viewport.height - 16) {
        top = viewport.height - tooltipRect.height - 16;
        if (position === 'bottom') finalPosition = 'top';
      }

      setTooltipPosition({ top, left });
      setActualPosition(finalPosition);
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [target, position]);

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-solid';
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white -bottom-2 left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white -top-2 left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white -right-2 top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseClasses} border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white -left-2 top-1/2 transform -translate-y-1/2`;
      default:
        return '';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white border-2 border-black shadow-lg max-w-md"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: '4px 4px 0px #A3A3A3',
        }}
      >
        {/* Arrow */}
        {actualPosition !== 'center' && (
          <div className={getArrowClasses()} />
        )}
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-gray-300">
          {step && totalSteps && (
            <div className="text-sm text-gray-600">
              Step {step} of {totalSteps}
            </div>
          )}
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 text-xl font-bold leading-none"
            aria-label="Close tooltip"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {typeof content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex justify-between items-center p-4 border-t-2 border-gray-300">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              className={`px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                !onPrevious ? 'invisible' : ''
              }`}
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              [← BACK]
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-gray-400 bg-white hover:bg-gray-100"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
              >
                [SKIP]
              </button>
              
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-gray-800"
                  style={{ fontFamily: "'Courier New', Courier, monospace" }}
                >
                  [NEXT →]
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tooltip;