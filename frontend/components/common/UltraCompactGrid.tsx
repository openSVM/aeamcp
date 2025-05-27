'use client';

import React from 'react';

interface UltraCompactGridProps {
  children?: React.ReactNode;
  minItemWidth?: number;
  maxColumns?: number;
  className?: string;
  loading?: boolean;
  loadingItems?: number;
}

const UltraCompactGrid: React.FC<UltraCompactGridProps> = ({
  children,
  minItemWidth = 240,
  maxColumns = 6,
  className = '',
  loading = false,
  loadingItems = 12,
}) => {
  if (loading) {
    return (
      <div className={`ultra-compact-grid ${className}`}>
        {Array.from({ length: loadingItems }, (_, i) => (
          <div key={i} className="ultra-compact-card loading">
            <div className="compact-skeleton h-3 w-3/4 mb-1"></div>
            <div className="compact-skeleton h-2 w-1/2 mb-2"></div>
            <div className="compact-skeleton h-2 w-full mb-1"></div>
            <div className="compact-skeleton h-2 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`ultra-compact-grid ${className}`}>
      {children}
    </div>
  );
};

export default UltraCompactGrid;