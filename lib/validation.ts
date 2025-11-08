import { ExpenseInput, EXPENSE_CATEGORIES, ValidationErrors } from './types';

/**
 * Validate expense input data
 */
export function validateExpenseInput(data: Partial<ExpenseInput>): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate amount
  if (data.amount === undefined || data.amount === null) {
    errors.amount = 'Amount is required';
  } else if (typeof data.amount !== 'number') {
    errors.amount = 'Amount must be a number';
  } else if (data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (isNaN(data.amount)) {
    errors.amount = 'Amount must be a valid number';
  }

  // Validate category
  if (!data.category) {
    errors.category = 'Category is required';
  } else if (typeof data.category !== 'string') {
    errors.category = 'Category must be a string';
  } else if (!EXPENSE_CATEGORIES.includes(data.category as any)) {
    errors.category = 'Invalid category';
  }

  // Validate date
  if (!data.date) {
    errors.date = 'Date is required';
  } else if (typeof data.date !== 'string') {
    errors.date = 'Date must be a string';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Date must be in YYYY-MM-DD format';
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.date = 'Invalid date';
      }
    }
  }

  // Validate note (optional)
  if (data.note !== undefined && data.note !== null && typeof data.note !== 'string') {
    errors.note = 'Note must be a string';
  }

  return errors;
}

/**
 * Validate profile data
 */
export function validateProfileData(data: { name?: string; preferred_currency?: string }): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name (optional)
  if (data.name !== undefined && data.name !== null) {
    if (typeof data.name !== 'string') {
      errors.name = 'Name must be a string';
    } else if (data.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }
  }

  // Validate currency
  if (data.preferred_currency !== undefined && data.preferred_currency !== null) {
    if (typeof data.preferred_currency !== 'string') {
      errors.preferred_currency = 'Currency must be a string';
    } else {
      const currency = data.preferred_currency.toUpperCase().trim();
      if (currency.length !== 3) {
        errors.preferred_currency = 'Currency must be a 3-letter code (e.g., USD, EUR)';
      } else if (!/^[A-Z]{3}$/.test(currency)) {
        errors.preferred_currency = 'Currency must contain only letters';
      }
    }
  }

  return errors;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { valid: true };
}

/**
 * Check if validation errors object has any errors
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get first validation error message
 */
export function getFirstValidationError(errors: ValidationErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}
