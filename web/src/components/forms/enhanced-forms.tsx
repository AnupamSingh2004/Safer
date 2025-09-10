/**
 * Smart Tourist Safety System - Enhanced Form Components
 * Advanced form handling with validation and better UX
 */

'use client';

import { useState, useEffect, ReactNode, ChangeEvent, FocusEvent } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Upload, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/advanced';

// ============================================================================
// VALIDATION TYPES AND UTILITIES
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface FieldState {
  value: any;
  error: string | null;
  touched: boolean;
  valid: boolean;
}

export interface FormState {
  [key: string]: FieldState;
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || 'This field is required';
    }

    if (value && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Minimum length is ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Maximum length is ${rule.maxLength} characters`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format';
      }
    }

    if (value && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return rule.message || `Minimum value is ${rule.min}`;
      }

      if (rule.max !== undefined && value > rule.max) {
        return rule.message || `Maximum value is ${rule.max}`;
      }
    }

    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }
  }

  return null;
}

// ============================================================================
// FORM HOOK
// ============================================================================

interface UseFormOptions {
  initialValues?: Record<string, any>;
  validationRules?: Record<string, ValidationRule[]>;
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
}

export function useForm({ initialValues = {}, validationRules = {}, onSubmit }: UseFormOptions) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        valid: true
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name: string, value: any) => {
    const rules = validationRules[name] || [];
    const error = validateField(value, rules);
    
    setFormState(prev => ({
      ...prev,
      [name]: {
        value,
        error,
        touched: prev[name]?.touched || false,
        valid: !error
      }
    }));
  };

  const setTouched = (name: string, touched = true) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched
      }
    }));
  };

  const validateForm = () => {
    const newState = { ...formState };
    let isValid = true;

    Object.keys(newState).forEach(name => {
      const rules = validationRules[name] || [];
      const error = validateField(newState[name].value, rules);
      newState[name] = {
        ...newState[name],
        error,
        touched: true,
        valid: !error
      };
      if (error) isValid = false;
    });

    setFormState(newState);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const values = Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].value;
        return acc;
      }, {} as Record<string, any>);

      await onSubmit(values);
      toast.success('Form submitted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormState(() => {
      const state: FormState = {};
      Object.keys(initialValues).forEach(key => {
        state[key] = {
          value: initialValues[key],
          error: null,
          touched: false,
          valid: true
        };
      });
      return state;
    });
  };

  const getFieldProps = (name: string) => ({
    value: formState[name]?.value || '',
    error: formState[name]?.touched ? formState[name]?.error : null,
    onChange: (value: any) => setValue(name, value),
    onBlur: () => setTouched(name, true)
  });

  const isValid = Object.values(formState).every(field => field.valid);
  const hasErrors = Object.values(formState).some(field => field.touched && field.error);

  return {
    formState,
    setValue,
    setTouched,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps,
    isValid,
    hasErrors,
    isSubmitting
  };
}

// ============================================================================
// INPUT COMPONENT
// ============================================================================

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string | number;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  icon?: ReactNode;
  helpText?: string;
  autoComplete?: string;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  className?: string;
}

export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  error,
  disabled = false,
  required = false,
  icon,
  helpText,
  autoComplete,
  onChange,
  onBlur,
  className = ''
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-3 py-2 border rounded-md text-sm transition-colors
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// ============================================================================
// SELECT COMPONENT
// ============================================================================

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  options: SelectOption[];
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  className?: string;
}

export function Select({
  label,
  placeholder = 'Select an option',
  value,
  options,
  error,
  disabled = false,
  required = false,
  helpText,
  onChange,
  onBlur,
  className = ''
}: SelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md text-sm transition-colors
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  helpText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export function Textarea({
  label,
  placeholder,
  value,
  error,
  disabled = false,
  required = false,
  rows = 3,
  maxLength,
  helpText,
  onChange,
  onBlur,
  className = ''
}: TextareaProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 border rounded-md text-sm transition-colors resize-vertical
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
      />
      
      <div className="flex justify-between mt-1">
        <div>
          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
          
          {helpText && !error && (
            <p className="text-sm text-gray-500">{helpText}</p>
          )}
        </div>
        
        {maxLength && (
          <p className="text-sm text-gray-500">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

export interface CheckboxProps {
  label: string;
  checked: boolean;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  error,
  disabled = false,
  required = false,
  helpText,
  onChange,
  className = ''
}: CheckboxProps) {
  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              h-4 w-4 rounded border-gray-300 transition-colors
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              text-blue-600 focus:ring-blue-500 focus:ring-offset-0
            `}
          />
        </div>
        <div className="ml-3">
          <label className={`text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {helpText && (
            <p className="text-sm text-gray-500 mt-1">{helpText}</p>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FILE UPLOAD COMPONENT
// ============================================================================

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  value: File | File[] | null;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  onChange: (files: File | File[] | null) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept,
  multiple = false,
  maxSize = 10,
  value,
  error,
  disabled = false,
  required = false,
  helpText,
  onChange,
  className = ''
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    // Validate file size
    const invalidFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    if (multiple) {
      onChange(files);
    } else {
      onChange(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {dragActive ? 'Drop files here' : 'Drop files here or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept && `Accepted: ${accept}`} • Max size: {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
              </div>
              <button
                onClick={() => onChange(multiple ? files.filter((_, i) => i !== index) : null)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// ============================================================================
// DATE PICKER COMPONENT
// ============================================================================

export interface DatePickerProps {
  label?: string;
  value: string;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  helpText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export function DatePicker({
  label,
  value,
  error,
  disabled = false,
  required = false,
  min,
  max,
  helpText,
  onChange,
  onBlur,
  className = ''
}: DatePickerProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full px-3 py-2 pl-10 border rounded-md text-sm transition-colors
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// ============================================================================
// FORM WRAPPER COMPONENT
// ============================================================================

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  className?: string;
}

export function Form({ onSubmit, children, className = '' }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
}

// ============================================================================
// FORM BUTTONS
// ============================================================================

interface FormButtonsProps {
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormButtons({
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  isSubmitting = false,
  disabled = false,
  className = ''
}: FormButtonsProps) {
  return (
    <div className={`flex justify-end space-x-3 ${className}`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      )}
      
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isSubmitting && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        <span>{isSubmitting ? 'Submitting...' : submitText}</span>
      </button>
    </div>
  );
}
