/**
 * Smart Tourist Safety System - Authentication Store (Frontend)
 * Simple Zustand store for authentication state management with JWT and permissions
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type {
  User,
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  ResetPasswordData,
  ForgotPasswordData,
  TokenPayload,
  AuthResponse,
  UserPreferences,
} from '@/types/auth';
import { API_ENDPOINTS, API_CONFIG } from '@/lib/constants';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
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
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  static async logout(): Promise<void> {
    return this.request<void>(API_ENDPOINTS.auth.logout, {
      method: 'POST',
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

  static async forgotPassword(email: string): Promise<void> {
    return this.request<void>(API_ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(resetData: ResetPasswordData): Promise<void> {
    return this.request<void>(API_ENDPOINTS.auth.resetPassword, {
      method: 'POST',
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
// AUTHENTICATION STORE
// ============================================================================

interface AuthStore extends AuthState, Omit<AuthActions, 'refreshToken'> {
  refreshTokens: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ======================================================================
        // AUTHENTICATION METHODS
        // ======================================================================

        login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
          try {
            set({ isLoading: true, error: null });

            const response = await AuthAPI.login(credentials);

            if (!response.success || !response.access_token || !response.user) {
              throw new Error(response.message || 'Login failed');
            }

            const tokenPayload = jwtDecode<TokenPayload>(response.access_token);
            
            set({
              user: response.user,
              token: response.access_token,
              refreshToken: response.refresh_token || null,
              isAuthenticated: true,
              expiresAt: new Date(tokenPayload.exp * 1000).toISOString(),
              lastActivity: new Date().toISOString(),
              isLoading: false,
              error: null,
              loginAttempts: 0,
              isLocked: false,
              lockoutUntil: null,
            });

            return response;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            
            set((state) => ({ 
              isLoading: false,
              error: errorMessage,
              loginAttempts: state.loginAttempts + 1,
              isLocked: state.loginAttempts + 1 >= 5,
              lockoutUntil: state.loginAttempts + 1 >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
            }));

            return { success: false, message: errorMessage };
          }
        },

        logout: async (): Promise<void> => {
          try {
            const { token } = get();
            
            if (token) {
              await AuthAPI.logout();
            }
          } catch (error) {
            console.error('Logout API call failed:', error);
          } finally {
            set(initialState);
          }
        },

        register: async (userData: RegisterData): Promise<AuthResponse> => {
          try {
            set({ isLoading: true, error: null });

            const response = await AuthAPI.register(userData);

            if (!response.success) {
              throw new Error(response.message || 'Registration failed');
            }

            return response;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            
            set({ 
              isLoading: false,
              error: errorMessage,
            });

            return { success: false, message: errorMessage };
          } finally {
            set({ isLoading: false });
          }
        },

        refreshTokens: async (): Promise<void> => {
          try {
            const { refreshToken } = get();
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await AuthAPI.refreshToken(refreshToken);

            if (response.success && response.access_token) {
              const tokenPayload = jwtDecode<TokenPayload>(response.access_token);
              
              set({
                token: response.access_token,
                refreshToken: response.refresh_token || refreshToken,
                expiresAt: new Date(tokenPayload.exp * 1000).toISOString(),
                lastActivity: new Date().toISOString(),
              });
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            get().refreshTokens();
          }
        },

        // ======================================================================
        // SESSION MANAGEMENT
        // ======================================================================

        initializeAuth: async (): Promise<void> => {
          try {
            set({ isLoading: true });

            const { token, refreshToken } = get();

            if (!token) {
              set({ isLoading: false, isInitialized: true });
              return;
            }

            // Check if token is valid
            try {
              const payload = jwtDecode<TokenPayload>(token);
              const now = Date.now() / 1000;
              
              if (payload.exp <= now) {
                // Token expired, try to refresh
                if (refreshToken) {
                  await get().refreshTokens();
                } else {
                  set(initialState);
                }
              } else {
                // Token valid, update last activity
                set({
                  lastActivity: new Date().toISOString(),
                  isInitialized: true,
                });
              }
            } catch (error) {
              console.error('Invalid token:', error);
              set(initialState);
            }
          } catch (error) {
            console.error('Auth initialization failed:', error);
            set(initialState);
          } finally {
            set({ isLoading: false, isInitialized: true });
          }
        },

        clearAuth: (): void => {
          set(initialState);
        },

        extendSession: (): void => {
          set({ lastActivity: new Date().toISOString() });
        },

        // ======================================================================
        // USER MANAGEMENT
        // ======================================================================

        updateProfile: async (updates: Partial<User>): Promise<void> => {
          try {
            const updatedUser = await AuthAPI.updateProfile(updates);
            set({ user: updatedUser });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
            set({ error: errorMessage });
            throw error;
          }
        },

        changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
          try {
            await AuthAPI.changePassword(passwordData);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password change failed';
            set({ error: errorMessage });
            throw error;
          }
        },

        updatePreferences: async (preferences: Partial<UserPreferences>): Promise<void> => {
          try {
            const updatedPreferences = await AuthAPI.updatePreferences(preferences);
            
            set((state) => ({
              user: state.user ? { ...state.user, preferences: updatedPreferences } : state.user,
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Preferences update failed';
            set({ error: errorMessage });
            throw error;
          }
        },

        // ======================================================================
        // PASSWORD RESET
        // ======================================================================

        requestPasswordReset: async (email: string): Promise<void> => {
          try {
            await AuthAPI.forgotPassword(email);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
            set({ error: errorMessage });
            throw error;
          }
        },

        resetPassword: async (resetData: ResetPasswordData): Promise<void> => {
          try {
            await AuthAPI.resetPassword(resetData);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
            set({ error: errorMessage });
            throw error;
          }
        },

        // ======================================================================
        // ERROR HANDLING
        // ======================================================================

        clearError: (): void => {
          set({ error: null });
        },

        setError: (error: string): void => {
          set({ error });
        },

        // ======================================================================
        // PERMISSION CHECKS
        // ======================================================================

        hasPermission: (permission: string): boolean => {
          const { isAuthenticated, user } = get();
          return isAuthenticated && (user?.permissions || []).includes(permission as any);
        },

        hasRole: (role: string): boolean => {
          const { isAuthenticated, user } = get();
          return isAuthenticated && user?.role === role;
        },

        hasAnyPermission: (permissions: string[]): boolean => {
          const { isAuthenticated, user } = get();
          if (!isAuthenticated || !user?.permissions) return false;
          return permissions.some(p => (user.permissions as any[])!.includes(p));
        },

        hasAllPermissions: (permissions: string[]): boolean => {
          const { isAuthenticated, user } = get();
          if (!isAuthenticated || !user?.permissions) return false;
          return permissions.every(p => (user.permissions as any[])!.includes(p));
        },

        canAccess: (resource: string, action: string): boolean => {
          const { isAuthenticated, user } = get();
          if (!isAuthenticated) return false;

          // Super admin can access everything
          if (user?.role === 'super_admin') return true;

          // Check specific permission patterns
          const permissionKey = `${action}_${resource}`;
          return (user?.permissions || []).includes(permissionKey as any);
        },
      }),
      {
        name: 'smart-tourist-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token,
          refreshToken: state.refreshToken,
          sessionId: state.sessionId,
          expiresAt: state.expiresAt,
          lastActivity: state.lastActivity,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.initializeAuth();
          }
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// ============================================================================
// HOOKS
// ============================================================================

export const useAuth = () => useAuthStore();

export const useUser = () => useAuthStore((state) => state.user);

export const useAuthUser = () => useAuthStore((state) => state.user);

export const useAuthStatus = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  register: state.register,
  refreshToken: state.refreshTokens,
  updateProfile: state.updateProfile,
  changePassword: state.changePassword,
  updatePreferences: state.updatePreferences,
  requestPasswordReset: state.requestPasswordReset,
  resetPassword: state.resetPassword,
  clearError: state.clearError,
  setError: state.setError,
}));

// ============================================================================
// INITIALIZE AUTH ON APP START
// ============================================================================

if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}

export default useAuthStore;
