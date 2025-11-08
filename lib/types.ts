// Database types
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  note?: string;
  date: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  note?: string;
  date: string;
}

export interface Profile {
  id: string;
  name?: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
}

// Aggregation types
export interface MonthlySummary {
  total: number;
  month: string;
  year: number;
}

export interface CategoryAggregate {
  category: string;
  total: number;
  percentage: number;
}

export interface DailySpending {
  date: string;
  total: number;
}

// AI types
export interface AIInsightsResponse {
  insights: string;
  generated_at: string;
}

// Predefined expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// API response types
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types for better error handling
export enum ErrorType {
  VALIDATION = 'Validation Error',
  AUTHENTICATION = 'Unauthorized',
  AUTHORIZATION = 'Forbidden',
  NOT_FOUND = 'Not Found',
  DATABASE = 'Database Error',
  NETWORK = 'Network Error',
  TIMEOUT = 'Timeout Error',
  AI_SERVICE = 'AI Service Error',
  CONFIGURATION = 'Configuration Error',
  INTERNAL = 'Internal Server Error',
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public statusCode: number = 500,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [field: string]: string;
}
