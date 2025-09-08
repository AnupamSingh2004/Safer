/**
 * Smart Tourist Safety System - Authentication Store
 * Zustand store for authentication state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { jwtDecode } from 'jwt-decode';
import type {
  AuthStore,
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  ResetPasswordData,
  AuthResponse,
  User,
  UserPreferences,
  TokenPayload,
} from '@/types/auth';
import { API_ENDPOINTS, API_CONFIG } from '@/lib/constants';

// ============================================================================
// AUTHENTICATION API
// ============================================================================

class AuthAPI {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = useAuthStore.getState().token;
    
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.auth.refresh, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async logout(sessionId?: string): Promise<void> {
    return this.request<void>(API_ENDPOINTS.auth.logout, {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  static async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    return this.request<{ valid: boolean; user?: User }>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async updateProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>(API_ENDPOINTS.auth.profile, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async changePassword(passwordData: ChangePasswordData): Promise<void> {
    return this.request<void>(API_ENDPOINTS.auth.changePassword, {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  static async requestPasswordReset(email: string): Promise<void> {
    return this.request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(resetData: ResetPasswordData): Promise<void> {
    return this.request<void>('/api/auth/reset-password', {
      method: 'PUT',
      body: JSON.stringify(resetData),
    });
  }

  static async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.request<UserPreferences>('/api/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
}

// ============================================================================
// TOKEN UTILITIES
// ============================================================================

class TokenManager {
  private static readonly TOKEN_KEY = 'sts_token';
  private static readonly REFRESH_TOKEN_KEY = 'sts_refresh_token';
  private static readonly SESSION_KEY = 'sts_session_id';

  static isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  static getTokenPayload(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }

  static getTokenExpiration(token: string): Date | null {
    const payload = this.getTokenPayload(token);
    return payload ? new Date(payload.exp * 1000) : null;
  }

  static isTokenExpiringSoon(token: string, thresholdMinutes = 5): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;
    
    const now = new Date();
    const threshold = new Date(now.getTime() + thresholdMinutes * 60 * 1000);
    return expiration <= threshold;
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  static setTokens(token: string, refreshToken: string, sessionId: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.SESSION_KEY, sessionId);
  }

  static getStoredTokens(): {
    token: string | null;
    refreshToken: string | null;
    sessionId: string | null;
  } {
    return {
      token: localStorage.getItem(this.TOKEN_KEY),
      refreshToken: localStorage.getItem(this.REFRESH_TOKEN_KEY),
      sessionId: localStorage.getItem(this.SESSION_KEY),
    };
  }
}

// ============================================================================
// DEFAULT AUTH STATE
// ============================================================================

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  user: null,
  token: null,
  refreshToken: null,
  sessionId: null,
  lastActivity: null,
  expiresAt: null,
  error: null,
  loginAttempts: 0,
  isLocked: false,
  lockoutUntil: null,
};

// ============================================================================
// ACTIVITY TRACKER
// ============================================================================

class ActivityTracker {
  private static lastActivity = Date.now();
  private static activityTimer: NodeJS.Timeout | null = null;
  private static readonly ACTIVITY_THRESHOLD = 60 * 1000; // 1 minute

  static startTracking(): void {
    this.updateActivity();
    
    // Track user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, this.updateActivity, true);
    });

    // Start periodic checking
    this.activityTimer = setInterval(() => {
      this.checkInactivity();
    }, this.ACTIVITY_THRESHOLD);
  }

  static stopTracking(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.removeEventListener(event, this.updateActivity, true);
    });

    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }
  }

  private static updateActivity = (): void => {
    const now = Date.now();
    if (now - this.lastActivity > this.ACTIVITY_THRESHOLD) {
      this.lastActivity = now;
      useAuthStore.getState().extendSession();
    }
  };

  private static checkInactivity(): void {
    const store = useAuthStore.getState();
    if (!store.isAuthenticated) return;

    const now = Date.now();
    const inactiveTime = now - this.lastActivity;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    if (inactiveTime > SESSION_TIMEOUT) {
      console.warn('Session timed out due to inactivity');
      store.logout();
    }
  }

  static getLastActivity(): Date {
    return new Date(this.lastActivity);
  }
}

// ============================================================================
// ZUSTAND STORE
// ============================================================================

interface AuthStoreState extends AuthState {
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  refreshAuthToken: () => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  clearAuth: () => void;
  extendSession: () => void;
  
  // User management
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  
  // Password reset
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (resetData: ResetPasswordData) => Promise<void>;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
  
  // Private methods
  setupAutoRefresh: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    immer((set, get) => ({
      // ========================================================================
      // INITIAL STATE
      // ========================================================================
      ...defaultAuthState,

      // ========================================================================
      // AUTHENTICATION METHODS
      // ========================================================================

      login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          const response = await AuthAPI.login(credentials);

          if (!response.success || !response.token || !response.user) {
            throw new Error(response.message || 'Login failed');
          }

          const tokenPayload = TokenManager.getTokenPayload(response.token);
          if (!tokenPayload) {
            throw new Error('Invalid token received');
          }

          // Store tokens
          TokenManager.setTokens(
            response.token,
            response.refreshToken || '',
            tokenPayload.sessionId
          );

          set((state) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = response.user!;
            state.token = response.token!;
            state.refreshToken = response.refreshToken || null;
            state.sessionId = tokenPayload.sessionId;
            state.expiresAt = response.expiresAt || new Date(tokenPayload.exp * 1000).toISOString();
            state.lastActivity = new Date().toISOString();
            state.error = null;
            state.loginAttempts = 0;
            state.isLocked = false;
            state.lockoutUntil = null;
          });

          // Start activity tracking
          ActivityTracker.startTracking();

          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
            state.loginAttempts += 1;
            
            // Lock account after 5 failed attempts
            if (state.loginAttempts >= 5) {
              state.isLocked = true;
              state.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
            }
          });

          return { success: false, message: errorMessage };
        }
      },

      logout: async (): Promise<void> => {
        try {
          const { sessionId } = get();
          
          // Call logout API if we have a session
          if (sessionId) {
            await AuthAPI.logout(sessionId);
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with local logout even if API fails
        } finally {
          // Always clear local state
          set((state) => {
            Object.assign(state, defaultAuthState);
          });

          // Clear stored tokens
          TokenManager.clearTokens();

          // Stop activity tracking
          ActivityTracker.stopTracking();
        }
      },

      register: async (userData: RegisterData): Promise<AuthResponse> => {
        try {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          const response = await AuthAPI.register(userData);

          set((state) => {
            state.isLoading = false;
          });

          return response;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          return { success: false, message: errorMessage };
        }
      },

      refreshAuthToken: async (): Promise<void> => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await AuthAPI.refreshToken(refreshToken);

          if (!response.success || !response.token) {
            throw new Error('Token refresh failed');
          }

          const tokenPayload = TokenManager.getTokenPayload(response.token);
          if (!tokenPayload) {
            throw new Error('Invalid refreshed token');
          }

          // Update stored tokens
          TokenManager.setTokens(
            response.token,
            response.refreshToken || refreshToken,
            tokenPayload.sessionId
          );

          set((state) => {
            state.token = response.token!;
            state.refreshToken = response.refreshToken || state.refreshToken;
            state.expiresAt = response.expiresAt || new Date(tokenPayload.exp * 1000).toISOString();
            state.lastActivity = new Date().toISOString();
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Force logout on refresh failure
          get().logout();
        }
      },

      // ========================================================================
      // SESSION MANAGEMENT
      // ========================================================================

      initializeAuth: async (): Promise<void> => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const { token, refreshToken, sessionId } = TokenManager.getStoredTokens();

          if (!token) {
            set((state) => {
              state.isLoading = false;
              state.isInitialized = true;
            });
            return;
          }

          // Check if token is valid
          if (!TokenManager.isTokenValid(token)) {
            // Try to refresh token
            if (refreshToken) {
              await get().refreshAuthToken();
            } else {
              // Clear invalid tokens
              TokenManager.clearTokens();
              set((state) => {
                Object.assign(state, defaultAuthState);
                state.isInitialized = true;
              });
              return;
            }
          }

          // Verify token with server
          const verification = await AuthAPI.verifyToken(token);
          
          if (!verification.valid || !verification.user) {
            TokenManager.clearTokens();
            set((state) => {
              Object.assign(state, defaultAuthState);
              state.isInitialized = true;
            });
            return;
          }

          const tokenPayload = TokenManager.getTokenPayload(token);
          
          set((state) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.isInitialized = true;
            state.user = verification.user!;
            state.token = token;
            state.refreshToken = refreshToken;
            state.sessionId = sessionId;
            state.expiresAt = tokenPayload ? new Date(tokenPayload.exp * 1000).toISOString() : null;
            state.lastActivity = new Date().toISOString();
          });

          // Start activity tracking
          ActivityTracker.startTracking();

          // Set up auto token refresh
          get().setupAutoRefresh();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          TokenManager.clearTokens();
          set((state) => {
            Object.assign(state, defaultAuthState);
            state.isInitialized = true;
          });
        }
      },

      clearAuth: (): void => {
        set((state) => {
          Object.assign(state, defaultAuthState);
        });
        TokenManager.clearTokens();
        ActivityTracker.stopTracking();
      },

      extendSession: (): void => {
        set((state) => {
          state.lastActivity = new Date().toISOString();
        });
      },

      // ========================================================================
      // USER MANAGEMENT
      // ========================================================================

      updateProfile: async (updates: Partial<User>): Promise<void> => {
        try {
          const updatedUser = await AuthAPI.updateProfile(updates);
          
          set((state) => {
            state.user = updatedUser;
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set((state) => {
            state.error = errorMessage;
          });
          throw error;
        }
      },

      changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
        try {
          await AuthAPI.changePassword(passwordData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password change failed';
          set((state) => {
            state.error = errorMessage;
          });
          throw error;
        }
      },

      updatePreferences: async (preferences: Partial<UserPreferences>): Promise<void> => {
        try {
          const updatedPreferences = await AuthAPI.updatePreferences(preferences);
          
          set((state) => {
            if (state.user) {
              state.user.preferences = updatedPreferences;
            }
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Preferences update failed';
          set((state) => {
            state.error = errorMessage;
          });
          throw error;
        }
      },

      // ========================================================================
      // PASSWORD RESET
      // ========================================================================

      requestPasswordReset: async (email: string): Promise<void> => {
        try {
          await AuthAPI.requestPasswordReset(email);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
          set((state) => {
            state.error = errorMessage;
          });
          throw error;
        }
      },

      resetPassword: async (resetData: ResetPasswordData): Promise<void> => {
        try {
          await AuthAPI.resetPassword(resetData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
          set((state) => {
            state.error = errorMessage;
          });
          throw error;
        }
      },

      // ========================================================================
      // ERROR HANDLING
      // ========================================================================

      clearError: (): void => {
        set((state) => {
          state.error = null;
        });
      },

      setError: (error: string): void => {
        set((state) => {
          state.error = error;
        });
      },

      // ========================================================================
      // PRIVATE METHODS
      // ========================================================================

      setupAutoRefresh: (): void => {
        const { token } = get();
        if (!token) return;

        const checkAndRefresh = () => {
          const currentState = get();
          if (!currentState.isAuthenticated || !currentState.token) return;

          if (TokenManager.isTokenExpiringSoon(currentState.token)) {
            currentState.refreshAuthToken();
          }
        };

        // Check every 5 minutes
        const interval = setInterval(checkAndRefresh, 5 * 60 * 1000);

        // Store interval to clear on logout
        (window as any).__authRefreshInterval = interval;
      },
    })),
    {
      name: 'smart-tourist-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist necessary data
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
        expiresAt: state.expiresAt,
        lastActivity: state.lastActivity,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize auth after rehydration
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);

// ============================================================================
// CLEANUP ON WINDOW UNLOAD
// ============================================================================

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ActivityTracker.stopTracking();
    
    // Clear auto-refresh interval
    const interval = (window as any).__authRefreshInterval;
    if (interval) {
      clearInterval(interval);
    }
  });
}

// ============================================================================
// HOOKS FOR AUTHENTICATION CHECKS
// ============================================================================

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    // Computed values
    isLoggedIn: store.isAuthenticated && !!store.user,
    isAdmin: store.user?.role === 'super_admin' || store.user?.role === 'tourism_admin' || store.user?.role === 'police_admin',
    isOperator: store.user?.role === 'operator' || store.user?.role === 'super_admin' || store.user?.role === 'tourism_admin' || store.user?.role === 'police_admin',
    isViewer: !!store.user?.role,
    
    // Helper methods
    hasPermission: (permission: string) => 
      store.user?.permissions?.includes(permission) ?? false,
    
    hasAnyPermission: (permissions: string[]) =>
      permissions.some(permission => store.user?.permissions?.includes(permission)) ?? false,
    
    hasRole: (role: string) => store.user?.role === role,
    
    hasAnyRole: (roles: string[]) => 
      store.user ? roles.includes(store.user.role) : false,
  };
};

export const useAuthUser = () => {
  return useAuthStore((state) => state.user);
};

export const useAuthStatus = () => {
  return useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,
  }));
};

export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    register: state.register,
    refreshAuthToken: state.refreshAuthToken,
    updateProfile: state.updateProfile,
    changePassword: state.changePassword,
    updatePreferences: state.updatePreferences,
    requestPasswordReset: state.requestPasswordReset,
    resetPassword: state.resetPassword,
    clearError: state.clearError,
    setError: state.setError,
  }));
};
