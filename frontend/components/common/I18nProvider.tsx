'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useI18n, Locale } from '../../lib/i18n';

interface I18nContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  t: (key: string) => string;
  locales: Locale[];
  localeNames: Record<Locale, string>;
  isHydrated: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const i18nData = useI18n();

  return (
    <I18nContext.Provider value={i18nData}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};