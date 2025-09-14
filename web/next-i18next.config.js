/** @type {import('next-i18next').UserConfig} */
module.exports = {
  // Internationalization Configuration for Smart Tourist Safety System
  i18n: {
    // Default language for the application
    defaultLocale: 'en',
    
    // Supported languages for the emergency response system
    locales: [
      'en',    // English (Primary)
      'hi',    // Hindi (National)
      'bn',    // Bengali
      'te',    // Telugu
      'mr',    // Marathi
      'ta',    // Tamil
      'gu',    // Gujarati
      'kn',    // Kannada
      'ml',    // Malayalam
      'pa',    // Punjabi
      'or',    // Odia
      'as',    // Assamese
    ],
    
    // Locale detection strategy
    localeDetection: {
      // Automatic locale detection from browser
      browser: true,
      // Check Accept-Language header
      header: true,
      // Use cookie to persist language preference
      cookie: 'tourist-safety-locale',
      // Fallback to default locale if detection fails
      fallback: 'en',
      // Don't redirect to locale-specific URLs automatically
      redirect: false,
    },
    
    // Domain-based locale routing (for future multi-domain setup)
    domains: [
      {
        domain: 'smarttouristsafety.gov.in',
        defaultLocale: 'en',
      },
      {
        domain: 'hi.smarttouristsafety.gov.in',
        defaultLocale: 'hi',
      },
    ],
  },
  
  // Namespace configuration for modular translations
  ns: [
    'common',           // Common UI elements
    'dashboard',        // Dashboard interface
    'auth',            // Authentication flows
    'emergency',       // Emergency responses
    'alerts',          // Alert system
    'tourists',        // Tourist management
    'zones',           // Zone management
    'blockchain',      // Blockchain features
    'analytics',       // Analytics dashboard
    'forms',           // Form validations
    'navigation',      // Navigation elements
    'errors',          // Error messages
    'success',         // Success messages
    'notifications',   // Real-time notifications
  ],
  
  // Default namespace to load
  defaultNS: 'common',
  
  // Fallback namespace if translation not found
  fallbackNS: 'common',
  
  // Translation loading configuration
  backend: {
    // Translation files location
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    
    // Enable caching for better performance
    addPath: '/locales/add/{{lng}}/{{ns}}',
    
    // Allow cross-origin requests for translations
    crossDomain: false,
    
    // Request timeout
    requestOptions: {
      cache: 'default',
      credentials: 'same-origin',
      mode: 'cors',
    },
  },
  
  // React configuration
  react: {
    // Use React Suspense for loading translations
    useSuspense: false,
    
    // Bind i18n instance to component tree
    bindI18n: 'languageChanged loaded',
    
    // Re-render when store changes
    bindI18nStore: 'added removed',
    
    // Transform translation function
    transEmptyNodeValue: '',
    
    // Handle missing translations
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
  },
  
  // Interpolation configuration for dynamic values
  interpolation: {
    // Escape HTML by default for security
    escapeValue: true,
    
    // Custom format functions for numbers, dates, etc.
    formatSeparator: ',',
    
    // Support for nested values
    nestingPrefix: '$t(',
    nestingSuffix: ')',
    
    // Support for context-based translations
    contextSeparator: '_',
    
    // Support for plural forms
    pluralSeparator: '_',
    
    // Custom format functions
    format: function(value, format, lng) {
      // Number formatting for different locales
      if (format === 'number') {
        return new Intl.NumberFormat(lng).format(value);
      }
      
      // Currency formatting for Indian Rupees
      if (format === 'currency') {
        return new Intl.NumberFormat(lng, {
          style: 'currency',
          currency: 'INR',
        }).format(value);
      }
      
      // Date formatting for emergency timestamps
      if (format === 'date') {
        return new Intl.DateTimeFormat(lng, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(value));
      }
      
      // Time formatting for real-time updates
      if (format === 'time') {
        return new Intl.DateTimeFormat(lng, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date(value));
      }
      
      // Emergency priority formatting
      if (format === 'priority') {
        const priorities = {
          en: { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' },
          hi: { critical: 'अत्यंत गंभीर', high: 'उच्च', medium: 'मध्यम', low: 'निम्न' },
        };
        return priorities[lng]?.[value] || value;
      }
      
      return value;
    },
  },
  
  // Debug configuration (only in development)
  debug: process.env.NODE_ENV === 'development',
  
  // Save missing translations for development
  saveMissing: process.env.NODE_ENV === 'development',
  
  // Custom missing key handler for emergency situations
  missingKeyHandler: function(lng, ns, key, fallbackValue) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${key} in ${lng}/${ns}`);
    }
    
    // For emergency-related keys, always return English fallback
    if (ns === 'emergency' && lng !== 'en') {
      return fallbackValue || key;
    }
    
    return fallbackValue || key;
  },
  
  // Language-specific configuration
  languageConfig: {
    en: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'English',
      nativeName: 'English',
    },
    hi: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Hindi',
      nativeName: 'हिन्दी',
    },
    bn: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Bengali',
      nativeName: 'বাংলা',
    },
    te: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Telugu',
      nativeName: 'తెలుగు',
    },
    mr: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Marathi',
      nativeName: 'मराठी',
    },
    ta: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Tamil',
      nativeName: 'தமிழ்',
    },
    gu: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
    },
    kn: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
    },
    ml: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
    },
    pa: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
    },
    or: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Odia',
      nativeName: 'ଓଡ଼ିଆ',
    },
    as: {
      dir: 'ltr',
      flag: '🇮🇳',
      name: 'Assamese',
      nativeName: 'অসমীয়া',
    },
  },
  
  // Performance optimizations
  load: 'languageOnly', // Don't load country-specific variants
  preload: ['en', 'hi'], // Preload critical languages
  cleanCode: true, // Clean language codes
  
  // SEO and metadata support
  supportedLngs: [
    'en', 'hi', 'bn', 'te', 'mr', 'ta', 
    'gu', 'kn', 'ml', 'pa', 'or', 'as'
  ],
  
  // Emergency contact numbers by region/language
  emergencyContacts: {
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
      // State-specific emergency numbers can be added here
      kerala: { tourist: '+91-471-2321132' },
      goa: { tourist: '+91-832-2438001' },
      rajasthan: { tourist: '+91-141-2200991' },
      himachal: { tourist: '+91-177-2625320' },
      uttarakhand: { tourist: '+91-135-2746817' },
      karnataka: { tourist: '+91-80-22212901' },
      tamilnadu: { tourist: '+91-44-25361350' },
      westbengal: { tourist: '+91-33-22144917' },
    },
  },
  
  // Security and privacy settings
  security: {
    // Don't expose debug info in production
    hideDebugOutput: process.env.NODE_ENV === 'production',
    
    // Sanitize user input in translations
    sanitizeInput: true,
    
    // Validate translation keys
    validateKeys: true,
  },
  
  // Performance monitoring
  monitoring: {
    // Track translation loading times
    trackLoadingTime: true,
    
    // Monitor missing translations
    trackMissingKeys: true,
    
    // Performance thresholds
    maxLoadingTime: 1000, // 1 second
  },
};