/**
 * Smart Tourist Safety System - Translation Hook
 * Comprehensive internationalization hook with dynamic language switching,
 * text direction support, number formatting, and emergency-specific features
 */

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

// Translation data imports
import enTranslations from '@/lib/i18n/translations/en.json';
import hiTranslations from '@/lib/i18n/translations/hi.json';

// Types for translation system
export interface TranslationMeta {
  language: string;
  code: string;
  direction: 'ltr' | 'rtl';
  version: string;
  lastUpdated: string;
  completeness: string;
  maintainer: string;
}

export interface TranslationConfig {
  emergencyContactNumbers: Record<string, string>;
  languageInfo: {
    dir: 'ltr' | 'rtl';
    flag: string;
    name: string;
    nativeName: string;
  };
  dateFormats: {
    short: string;
    long: string;
    time: string;
    dateTime: string;
  };
  numberFormats: {
    decimal: Intl.NumberFormatOptions;
    currency: Intl.NumberFormatOptions;
    percent: Intl.NumberFormatOptions;
  };
}

export interface UseTranslationOptions {
  namespace?: string;
  fallbackNamespace?: string;
  interpolation?: Record<string, any>;
  pluralization?: boolean;
  context?: string;
}

export interface TranslationFunction {
  (key: string, options?: UseTranslationOptions & { 
    count?: number; 
    defaultValue?: string;
    interpolation?: Record<string, any>;
  }): string;
}

// Available languages with comprehensive configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'English',
    nativeName: 'English',
    rtl: false,
  },
  hi: {
    dir: 'ltr' as const,
    flag: '🇮🇳', 
    name: 'Hindi',
    nativeName: 'हिन्दी',
    rtl: false,
  },
  // Additional languages can be added here
  bn: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Bengali',
    nativeName: 'বাংলা',
    rtl: false,
  },
  te: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Telugu', 
    nativeName: 'తెలుగు',
    rtl: false,
  },
  mr: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Marathi',
    nativeName: 'मराठी',
    rtl: false,
  },
  ta: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    rtl: false,
  },
  gu: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    rtl: false,
  },
  kn: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    rtl: false,
  },
  ml: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    rtl: false,
  },
  pa: {
    dir: 'ltr' as const,
    flag: '🇮🇳',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    rtl: false,
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Translation data registry
const TRANSLATIONS = {
  en: enTranslations,
  hi: hiTranslations,
  // Fallback to English for other languages until translations are available
  bn: enTranslations,
  te: enTranslations,
  mr: enTranslations,
  ta: enTranslations,
  gu: enTranslations,
  kn: enTranslations,
  ml: enTranslations,
  pa: enTranslations,
} as const;

// Emergency contact numbers by language/region
const EMERGENCY_CONTACTS = {
  national: {
    emergency: '112',
    police: '100',
    fire: '101',
    medical: '108',
    tourist: '1363',
    women: '1091',
    child: '1098',
  },
  regional: {
    // State-specific numbers can be added based on user location
    kerala: { tourist: '+91-471-2321132' },
    goa: { tourist: '+91-832-2438001' },
    rajasthan: { tourist: '+91-141-2200991' },
    himachal: { tourist: '+91-177-2625320' },
    uttarakhand: { tourist: '+91-135-2746817' },
    karnataka: { tourist: '+91-80-22212901' },
    tamilnadu: { tourist: '+91-44-25361350' },
    westbengal: { tourist: '+91-33-22144917' },
  },
} as const;

// Language detection utilities
const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language?.split('-')[0] as SupportedLanguage;
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) ? browserLang : 'en';
};

const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('tourist-safety-locale') as SupportedLanguage;
  return Object.keys(SUPPORTED_LANGUAGES).includes(stored) ? stored : 'en';
};

// Translation utilities
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const interpolateString = (str: string, values: Record<string, any> = {}): string => {
  return str.replace(/\\{\\{(.*?)\\}\\}/g, (match, key) => {
    const value = values[key.trim()];
    return value !== undefined ? String(value) : match;
  });
};

const pluralize = (key: string, count: number, translations: any): string => {
  const pluralKey = count === 1 ? key : `${key}_plural`;
  return getNestedValue(translations, pluralKey) || getNestedValue(translations, key);
};

// Advanced formatting functions
const formatNumber = (value: number, locale: string, options: Intl.NumberFormatOptions = {}): string => {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    console.warn('Number formatting failed:', error);
    return value.toString();
  }
};

const formatDate = (
  value: Date | string | number, 
  locale: string, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.warn('Date formatting failed:', error);
    return String(value);
  }
};

const formatCurrency = (value: number, locale: string): string => {
  return formatNumber(value, locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatRelativeTime = (value: Date | string | number, locale: string): string => {
  try {
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    
    return formatDate(date, locale, { dateStyle: 'medium' });
  } catch (error) {
    console.warn('Relative time formatting failed:', error);
    return String(value);
  }
};

// Main translation hook
export const useTranslation = (defaultNamespace = 'common') => {
  const router = useRouter();
  
  // State management
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    return getStoredLanguage() || detectBrowserLanguage();
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Memoized values for performance
  const languageConfig = useMemo(() => SUPPORTED_LANGUAGES[currentLanguage], [currentLanguage]);
  const translations = useMemo(() => TRANSLATIONS[currentLanguage], [currentLanguage]);
  const emergencyContacts = useMemo(() => EMERGENCY_CONTACTS.national, []);

  // Translation function with advanced features
  const t: TranslationFunction = useCallback((
    key: string, 
    options: UseTranslationOptions & { 
      count?: number; 
      defaultValue?: string;
      interpolation?: Record<string, any>;
    } = {}
  ) => {
    const {
      namespace = defaultNamespace,
      fallbackNamespace = 'common',
      interpolation = {},
      count,
      defaultValue = key,
      context
    } = options;

    try {
      // Build the full key path
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const contextKey = context ? `${fullKey}_${context}` : fullKey;
      
      // Try to get translation with context first
      let translatedText = getNestedValue(translations, contextKey);
      
      // Fall back to key without context
      if (!translatedText) {
        translatedText = getNestedValue(translations, fullKey);
      }
      
      // Fall back to fallback namespace
      if (!translatedText && fallbackNamespace !== namespace) {
        const fallbackKey = `${fallbackNamespace}.${key}`;
        translatedText = getNestedValue(translations, fallbackKey);
      }
      
      // Fall back to English translations
      if (!translatedText && currentLanguage !== 'en') {
        const englishTranslation = getNestedValue(TRANSLATIONS.en, fullKey);
        if (englishTranslation) {
          translatedText = englishTranslation;
          console.warn(`Missing translation for "${fullKey}" in "${currentLanguage}", using English fallback`);
        }
      }
      
      // Use default value if no translation found
      if (!translatedText) {
        console.warn(`Missing translation for "${fullKey}"`);
        translatedText = defaultValue;
      }
      
      // Handle pluralization
      if (typeof count === 'number' && translatedText) {
        translatedText = pluralize(fullKey, count, translations) || translatedText;
      }
      
      // Handle interpolation
      if (translatedText && Object.keys(interpolation).length > 0) {
        translatedText = interpolateString(translatedText, interpolation);
      }
      
      return translatedText || defaultValue;
    } catch (error) {
      console.error('Translation error:', error);
      return defaultValue;
    }
  }, [currentLanguage, translations, defaultNamespace]);

  // Language switching with persistence and URL update
  const changeLanguage = useCallback(async (newLanguage: SupportedLanguage) => {
    if (newLanguage === currentLanguage) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // Simulate loading progress for better UX
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 20, 90));
      }, 100);
      
      // Store language preference
      localStorage.setItem('tourist-safety-locale', newLanguage);
      
      // Update document language and direction
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLanguage;
        document.documentElement.dir = SUPPORTED_LANGUAGES[newLanguage].dir;
      }
      
      // Update state
      setCurrentLanguage(newLanguage);
      
      // Update URL with language parameter
      const { pathname, query } = router;
      await router.push({
        pathname,
        query: { ...query, lang: newLanguage },
      }, undefined, { shallow: true });
      
      // Complete loading
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      // Trigger custom event for other components to react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { language: newLanguage, config: SUPPORTED_LANGUAGES[newLanguage] }
        }));
      }
      
    } catch (error) {
      console.error('Language change failed:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 200);
    }
  }, [currentLanguage, router]);

  // Format functions with current locale
  const formatters = useMemo(() => ({
    number: (value: number, options?: Intl.NumberFormatOptions) => 
      formatNumber(value, currentLanguage, options),
    
    currency: (value: number) => 
      formatCurrency(value, currentLanguage),
    
    date: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => 
      formatDate(value, currentLanguage, options),
    
    time: (value: Date | string | number) => 
      formatDate(value, currentLanguage, { timeStyle: 'medium' }),
    
    dateTime: (value: Date | string | number) => 
      formatDate(value, currentLanguage, { dateStyle: 'medium', timeStyle: 'short' }),
    
    relativeTime: (value: Date | string | number) => 
      formatRelativeTime(value, currentLanguage),
    
    emergency: (type: keyof typeof EMERGENCY_CONTACTS.national) => 
      emergencyContacts[type] || '112',
      
    percentage: (value: number) => 
      formatNumber(value, currentLanguage, { style: 'percent', minimumFractionDigits: 1 }),
  }), [currentLanguage, emergencyContacts]);

  // Emergency-specific translation function
  const te = useCallback((key: string, options?: UseTranslationOptions) => {
    return t(key, { ...options, namespace: 'emergency' });
  }, [t]);

  // Initialize language from URL or stored preference
  useEffect(() => {
    const urlLang = router.query.lang as SupportedLanguage;
    if (urlLang && Object.keys(SUPPORTED_LANGUAGES).includes(urlLang)) {
      changeLanguage(urlLang);
    }
  }, [router.query.lang, changeLanguage]);

  // Set document language and direction on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = languageConfig.dir;
    }
  }, [currentLanguage, languageConfig.dir]);

  // Return hook interface
  return {
    // Translation functions
    t,
    te, // Emergency translations
    
    // Language management
    language: currentLanguage,
    languages: SUPPORTED_LANGUAGES,
    changeLanguage,
    isLoading,
    loadingProgress,
    
    // Language configuration
    dir: languageConfig.dir,
    isRTL: languageConfig.dir === 'rtl',
    languageInfo: languageConfig,
    
    // Formatting utilities
    formatters,
    
    // Emergency contacts
    emergencyContacts,
    
    // Utility functions
    ready: !isLoading,
    exists: (key: string, namespace = defaultNamespace) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return !!getNestedValue(translations, fullKey);
    },
    
    // Meta information
    meta: translations.meta as TranslationMeta,
  };
};

// Convenience hooks for specific namespaces
export const useAuthTranslation = () => useTranslation('auth');
export const useDashboardTranslation = () => useTranslation('dashboard');
export const useEmergencyTranslation = () => useTranslation('emergency');
export const useAlertTranslation = () => useTranslation('alerts');
export const useTouristTranslation = () => useTranslation('tourists');
export const useZoneTranslation = () => useTranslation('zones');
export const useBlockchainTranslation = () => useTranslation('blockchain');
export const useAnalyticsTranslation = () => useTranslation('analytics');
export const useFormTranslation = () => useTranslation('forms');

// Higher-order component for translation context
export const withTranslation = <P extends object>(
  Component: React.ComponentType<P & { t: TranslationFunction }>,
  namespace?: string
) => {
  const TranslatedComponent = (props: P) => {
    const { t } = useTranslation(namespace);
    return <Component {...props} t={t} />;
  };
  
  TranslatedComponent.displayName = `withTranslation(${Component.displayName || Component.name})`;
  return TranslatedComponent;
};

// Language picker component props
export interface LanguagePickerProps {
  className?: string;
  showFlags?: boolean;
  showNativeNames?: boolean;
  variant?: 'dropdown' | 'buttons' | 'modal';
  size?: 'sm' | 'md' | 'lg';
}

// Export types and constants
export type { SupportedLanguage, TranslationMeta, TranslationConfig };
export { EMERGENCY_CONTACTS, TRANSLATIONS };