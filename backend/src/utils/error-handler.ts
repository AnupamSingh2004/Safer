// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class DatabaseError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code || 'DATABASE_ERROR';
    this.statusCode = 500;
  }
}

export class ValidationError extends Error {
  public fields: string[];
  public statusCode: number;

  constructor(message: string, fields?: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields || [];
    this.statusCode = 400;
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

// ============================================================================
// ERROR HANDLER FUNCTION
// ============================================================================

export function handleError(error: any): {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
} {
  if (error instanceof DatabaseError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      statusCode: error.statusCode,
      details: error.fields
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      message: error.message,
      code: 'AUTHORIZATION_ERROR',
      statusCode: error.statusCode
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      message: error.message,
      code: 'AUTHENTICATION_ERROR',
      statusCode: error.statusCode
    };
  }

  if (error instanceof NotFoundError) {
    return {
      message: error.message,
      code: 'NOT_FOUND_ERROR',
      statusCode: error.statusCode
    };
  }

  if (error instanceof ConflictError) {
    return {
      message: error.message,
      code: 'CONFLICT_ERROR',
      statusCode: error.statusCode
    };
  }

  // Handle PostgreSQL/Supabase errors
  if (error.code === '23505') {
    return {
      message: 'Duplicate entry found',
      code: 'DUPLICATE_ERROR',
      statusCode: 409
    };
  }

  if (error.code === '23503') {
    return {
      message: 'Referenced record not found',
      code: 'REFERENCE_ERROR',
      statusCode: 400
    };
  }

  // Default error
  return {
    message: error.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  };
}

export default {
  DatabaseError,
  ValidationError,
  AuthorizationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  handleError
};
