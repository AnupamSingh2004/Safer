import * as z from 'zod';

// ============================================================================
// USER VALIDATION SCHEMAS
// ============================================================================

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  role: z.enum(['admin', 'operator', 'analyst', 'field_agent', 'super_admin']),
  department: z.string().min(1, 'Department is required').max(100, 'Department name too long'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const UserUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  role: z.enum(['admin', 'operator', 'analyst', 'field_agent', 'super_admin']).optional(),
  department: z.string().min(1, 'Department is required').max(100, 'Department name too long').optional(),
  isActive: z.boolean().optional()
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateUserInput(data: any, schema: z.ZodSchema) {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    throw error;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateRole(role: string): boolean {
  const validRoles = ['admin', 'operator', 'analyst', 'field_agent', 'super_admin'];
  return validRoles.includes(role);
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

export default {
  validateUserInput,
  validateEmail,
  validatePassword,
  validateRole,
  sanitizeInput,
  UserCreateSchema,
  UserUpdateSchema
};
