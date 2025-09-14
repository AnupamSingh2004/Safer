/**
 * API Type Definitions
 * Common types for API communication
 */

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  expiresIn?: number;
}

// ============================================================================
// QUERY PARAMETERS
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface TouristQueryParams extends PaginationParams, SortParams, FilterParams {
  riskLevel?: string;
  nationality?: string;
  safetyScoreMin?: number;
  safetyScoreMax?: number;
}

export interface AlertQueryParams extends PaginationParams, SortParams, FilterParams {
  severity?: string;
  touristId?: string;
  assignedTo?: string;
  resolved?: boolean;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
}