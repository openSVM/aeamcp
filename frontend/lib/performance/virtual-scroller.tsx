/**
 * Virtual Scrolling Component
 * 
 * Provides high-performance rendering of large lists by only rendering
 * visible items, with smooth scrolling and dynamic height support.
 */

import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  ReactNode 
} from 'react';

/**
 * Virtual scroller props
 */
export interface VirtualScrollerProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Container height in pixels */
  containerHeight: number;
  /** Container width (optional) */
  containerWidth?: number | string;
  /** Number of items to render outside visible area (buffer) */
  overscan?: number;
  /** Render function for each item */
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  /** Optional render function for loading skeleton */
  renderSkeleton?: (index: number, style: React.CSSProperties) => ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when scrolled to bottom (for infinite scroll) */
  onEndReached?: () => void;
  /** Threshold for triggering onEndReached (0-1) */
  endReachedThreshold?: number;
  /** Custom class name */
  className?: string;
  /** Whether to use dynamic heights */
  dynamicHeight?: boolean;
  /** Callback to measure item height (for dynamic heights) */
  getItemHeight?: (item: T, index: number) => number;
}

/**
 * Virtual item data
 */
interface VirtualItem {
  index: number;
  start: number;
  end: number;
  height: number;
}

/**
 * Virtual Scroller Hook
 */
function useVirtualScroller<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  dynamicHeight = false,
  getItemHeight
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  dynamicHeight?: boolean;
  getItemHeight?: (item: T, index: number) => number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Map<number, number>>(new Map());

  // Calculate item heights
  const getHeight = useCallback((item: T, index: number): number => {
    if (dynamicHeight && getItemHeight) {
      return getItemHeight(item, index);
    }
    if (dynamicHeight && measuredHeights.has(index)) {
      return measuredHeights.get(index)!;
    }
    return itemHeight;
  }, [dynamicHeight, getItemHeight, measuredHeights, itemHeight]);

  // Calculate total height and item positions
  const { totalHeight, itemPositions } = useMemo(() => {
    let currentOffset = 0;
    const positions: number[] = [];
    
    for (let i = 0; i < items.length; i++) {
      positions[i] = currentOffset;
      currentOffset += getHeight(items[i], i);
    }
    
    return {
      totalHeight: currentOffset,
      itemPositions: positions
    };
  }, [items, getHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.max(0, 
      itemPositions.findIndex(pos => pos + itemHeight >= scrollTop) - overscan
    );
    
    let end = itemPositions.findIndex(pos => pos > scrollTop + containerHeight) + overscan;
    if (end === -1 + overscan) {
      end = items.length;
    }
    
    return { start, end: Math.min(end, items.length) };
  }, [scrollTop, containerHeight, itemPositions, itemHeight, overscan, items.length]);

  // Calculate virtual items
  const virtualItems: VirtualItem[] = useMemo(() => {
    const virtualItemsList: VirtualItem[] = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      const start = itemPositions[i];
      const height = getHeight(items[i], i);
      
      virtualItemsList.push({
        index: i,
        start,
        end: start + height,
        height
      });
    }
    
    return virtualItemsList;
  }, [visibleRange, itemPositions, getHeight, items]);

  return {
    virtualItems,
    totalHeight,
    scrollTop,
    setScrollTop,
    measuredHeights,
    setMeasuredHeights
  };
}

/**
 * Virtual Scroller Component
 */
export function VirtualScroller<T>({
  items,
  itemHeight,
  containerHeight,
  containerWidth = '100%',
  overscan = 5,
  renderItem,
  renderSkeleton,
  loading = false,
  error,
  onEndReached,
  endReachedThreshold = 0.8,
  className = '',
  dynamicHeight = false,
  getItemHeight
}: VirtualScrollerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    virtualItems,
    totalHeight,
    scrollTop,
    setScrollTop,
    measuredHeights,
    setMeasuredHeights
  } = useVirtualScroller({
    items,
    itemHeight,
    containerHeight,
    overscan,
    dynamicHeight,
    getItemHeight
  });

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    
    // Set scrolling state
    isScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set timeout to detect end of scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
    
    // Check if we've reached the end
    if (onEndReached) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage >= endReachedThreshold) {
        onEndReached();
      }
    }
  }, [setScrollTop, onEndReached, endReachedThreshold]);

  // Measure item height for dynamic sizing
  const measureItem = useCallback((index: number, element: HTMLElement) => {
    if (dynamicHeight && element) {
      const height = element.getBoundingClientRect().height;
      setMeasuredHeights(prev => {
        const newMap = new Map(prev);
        newMap.set(index, height);
        return newMap;
      });
    }
  }, [dynamicHeight, setMeasuredHeights]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => {
    if (!renderSkeleton) {
      return (
        <div className="animate-pulse space-y-2 p-4">
          {Array.from({ length: Math.ceil(containerHeight / itemHeight) }).map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 rounded"
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      );
    }

    const skeletonItems = Array.from({ length: Math.ceil(containerHeight / itemHeight) });
    return (
      <>
        {skeletonItems.map((_, index) => 
          renderSkeleton(index, {
            position: 'absolute',
            top: index * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight
          })
        )}
      </>
    );
  };

  // Render error state
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight, width: containerWidth }}
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading && items.length === 0) {
    return (
      <div 
        className={`relative ${className}`}
        style={{ height: containerHeight, width: containerWidth }}
      >
        {renderLoadingSkeleton()}
      </div>
    );
  }

  // Render empty state
  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height: containerHeight, width: containerWidth }}
      >
        <div className="text-center text-gray-500">
          <div className="mb-2">📭</div>
          <div className="text-sm">No items to display</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ 
        height: containerHeight, 
        width: containerWidth,
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      {/* Total container to establish scrollable height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Render visible items */}
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          const style: React.CSSProperties = {
            position: 'absolute',
            top: virtualItem.start,
            left: 0,
            right: 0,
            height: virtualItem.height
          };

          return (
            <div
              key={virtualItem.index}
              style={style}
              ref={dynamicHeight ? (el) => { if (el) measureItem(virtualItem.index, el); } : undefined}
            >
              {renderItem(item, virtualItem.index, style)}
            </div>
          );
        })}
        
        {/* Loading indicator at bottom */}
        {loading && items.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: totalHeight,
              left: 0,
              right: 0,
              height: 60
            }}
            className="flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Virtualized Grid Component
 */
export interface VirtualGridProps<T> {
  /** Array of items to render */
  items: T[];
  /** Number of columns */
  columns: number;
  /** Height of each row in pixels */
  rowHeight: number;
  /** Container height in pixels */
  containerHeight: number;
  /** Container width */
  containerWidth?: number | string;
  /** Gap between items */
  gap?: number;
  /** Number of rows to render outside visible area */
  overscan?: number;
  /** Render function for each item */
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Callback when scrolled to bottom */
  onEndReached?: () => void;
  /** Custom class name */
  className?: string;
}

export function VirtualGrid<T>({
  items,
  columns,
  rowHeight,
  containerHeight,
  containerWidth = '100%',
  gap = 0,
  overscan = 2,
  renderItem,
  loading = false,
  error,
  onEndReached,
  className = ''
}: VirtualGridProps<T>) {
  // Group items into rows
  const rows = useMemo(() => {
    const grouped: T[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      grouped.push(items.slice(i, i + columns));
    }
    return grouped;
  }, [items, columns]);

  const rowItemHeight = rowHeight + gap;

  return (
    <VirtualScroller
      items={rows}
      itemHeight={rowItemHeight}
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      overscan={overscan}
      loading={loading}
      error={error}
      onEndReached={onEndReached}
      className={className}
      renderItem={(row, rowIndex, style) => (
        <div
          style={{
            ...style,
            display: 'flex',
            gap: gap,
            paddingBottom: gap
          }}
        >
          {row.map((item, colIndex) => {
            const itemIndex = rowIndex * columns + colIndex;
            const itemStyle: React.CSSProperties = {
              flex: `1 1 ${100 / columns}%`,
              height: rowHeight
            };
            
            return (
              <div key={itemIndex} style={itemStyle}>
                {renderItem(item, itemIndex, itemStyle)}
              </div>
            );
          })}
          
          {/* Fill empty columns in last row */}
          {row.length < columns && Array.from({ length: columns - row.length }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              style={{ flex: `1 1 ${100 / columns}%` }} 
            />
          ))}
        </div>
      )}
    />
  );
}

/**
 * Infinite Scroll Hook for Virtual Scroller
 */
export function useInfiniteScroll<T>({
  initialItems,
  fetchMore,
  hasMore = true,
  threshold = 0.8
}: {
  initialItems: T[];
  fetchMore: () => Promise<T[]>;
  hasMore?: boolean;
  threshold?: number;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEndReached = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const newItems = await fetchMore();
      setItems(prev => [...prev, ...newItems]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, fetchMore]);

  // Update items when initialItems change
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    loading,
    error,
    handleEndReached,
    endReachedThreshold: threshold
  };
}

export default VirtualScroller;