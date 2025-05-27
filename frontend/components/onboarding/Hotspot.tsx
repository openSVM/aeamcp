'use client';

import React, { useEffect, useState, useRef } from 'react';
import { HotspotProps } from './types';

export const Hotspot: React.FC<HotspotProps> = ({
  target,
  position,
  content,
  action = 'click',
  onAction,
  isActive,
  className = '',
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [hotspotPosition, setHotspotPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const hotspotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const findTarget = () => {
      const element = document.querySelector(target) as HTMLElement;
      if (element) {
        setTargetElement(element);
        updatePosition(element);
      }
    };

    const updatePosition = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setHotspotPosition({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height,
      });
    };

    // Initial setup
    findTarget();

    // Update position on scroll and resize
    const handleUpdate = () => {
      if (targetElement) {
        updatePosition(targetElement);
      }
    };

    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      if (!targetElement) {
        findTarget();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
    };
  }, [target, isActive, targetElement]);

  useEffect(() => {
    if (!isActive || !targetElement) return;

    const handleInteraction = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      onAction();
    };

    switch (action) {
      case 'click':
        targetElement.addEventListener('click', handleInteraction);
        break;
      case 'hover':
        targetElement.addEventListener('mouseenter', handleInteraction);
        break;
      case 'scroll':
        window.addEventListener('scroll', handleInteraction);
        break;
      case 'auto':
        // Auto-trigger after a delay
        const timer = setTimeout(onAction, 2000);
        return () => clearTimeout(timer);
    }

    return () => {
      switch (action) {
        case 'click':
          targetElement.removeEventListener('click', handleInteraction);
          break;
        case 'hover':
          targetElement.removeEventListener('mouseenter', handleInteraction);
          break;
        case 'scroll':
          window.removeEventListener('scroll', handleInteraction);
          break;
      }
    };
  }, [targetElement, action, onAction, isActive]);

  if (!isActive || !targetElement) {
    return null;
  }

  return (
    <>
      {/* Overlay to darken everything except the target */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `
            linear-gradient(transparent, transparent),
            radial-gradient(
              ellipse ${hotspotPosition.width + 20}px ${hotspotPosition.height + 20}px at 
              ${hotspotPosition.left + hotspotPosition.width / 2}px 
              ${hotspotPosition.top + hotspotPosition.height / 2}px,
              transparent 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.7) 50%
            )
          `,
        }}
      />

      {/* Hotspot highlight */}
      <div
        ref={hotspotRef}
        className={`fixed z-40 pointer-events-none ${className}`}
        style={{
          top: hotspotPosition.top - 10,
          left: hotspotPosition.left - 10,
          width: hotspotPosition.width + 20,
          height: hotspotPosition.height + 20,
          border: '3px dashed #FFD700',
          borderRadius: '8px',
          background: 'rgba(255, 215, 0, 0.1)',
          animation: 'onboarding-pulse 2s infinite',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        }}
      />

      {/* Click indicator for click actions */}
      {action === 'click' && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: hotspotPosition.top + hotspotPosition.height / 2 - 15,
            left: hotspotPosition.left + hotspotPosition.width / 2 - 15,
            width: 30,
            height: 30,
            border: '2px solid #FFD700',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.2)',
            animation: 'onboarding-click-pulse 1.5s infinite',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-yellow-600 font-bold text-xs"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            CLICK
          </div>
        </div>
      )}

      {/* Hover indicator for hover actions */}
      {action === 'hover' && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: hotspotPosition.top - 40,
            left: hotspotPosition.left + hotspotPosition.width / 2 - 25,
            width: 50,
            height: 20,
            background: '#FFD700',
            border: '2px solid #000',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          HOVER
        </div>
      )}

      {/* Scroll indicator for scroll actions */}
      {action === 'scroll' && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: hotspotPosition.top + hotspotPosition.height + 10,
            left: hotspotPosition.left + hotspotPosition.width / 2 - 30,
            width: 60,
            height: 20,
            background: '#FFD700',
            border: '2px solid #000',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          SCROLL
        </div>
      )}

      {/* Auto indicator for auto actions */}
      {action === 'auto' && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: hotspotPosition.top - 30,
            left: hotspotPosition.left + hotspotPosition.width / 2 - 20,
            width: 40,
            height: 20,
            background: '#FFD700',
            border: '2px solid #000',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          AUTO
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default Hotspot;