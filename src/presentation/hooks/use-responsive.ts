'use client';

import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024 && width < 1280);
      setIsLargeDesktop(width >= 1280);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getGridCols = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-2';
    if (isDesktop) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const getChartHeight = () => {
    if (isMobile) return 'h-64';
    if (isTablet) return 'h-72';
    return 'h-80';
  };

  const getSpacing = () => {
    if (isMobile) return 'space-y-4';
    if (isTablet) return 'space-y-6';
    return 'space-y-8';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    getGridCols,
    getChartHeight,
    getSpacing,
  };
};
