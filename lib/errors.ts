import { ErrorType, AppError } from './types';

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: ErrorType | string,
  message: string,
  statusCode: number = 500
) {
  return {
    error,
    message,
    statusCode,
  };
}

/**
 * Parse error from API response or exception
 */
export function parseError(error: unknown): { message: string; isRetryable: boolean } {
  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      isRetryable: error.isRetryable,
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      isRetryable: false,
    };
  }

  // Handle API error responses
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    if (err.message) {
      return {
        message: err.message,
        isRetryable: err.statusCode >= 500 || err.statusCode === 408 || err.statusCode === 429,
      };
    }
  }

  // Default error message
  return {
    message: 'An unexpected error occurred',
    isRetryable: false,
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('timeout')
    );
  }
  
  return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isRetryable;
  }

  if (isNetworkError(error)) {
    return true;
  }

  // Check for specific HTTP status codes
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    const statusCode = err.statusCode || err.status;
    
    // Retry on server errors, timeouts, and rate limits
    return statusCode >= 500 || statusCode === 408 || statusCode === 429 || statusCode === 504;
  }

  return false;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Handle Supabase errors and convert to AppError
 */
export function handleSupabaseError(error: any): AppError {
  const message = error.message || 'Database operation failed';
  const code = error.code;

  // Handle specific Supabase error codes
  switch (code) {
    case 'PGRST116': // Not found
      return new AppError(ErrorType.NOT_FOUND, 'Resource not found', 404, false);
    
    case '23505': // Unique violation
      return new AppError(ErrorType.VALIDATION, 'A record with this value already exists', 400, false);
    
    case '23503': // Foreign key violation
      return new AppError(ErrorType.VALIDATION, 'Referenced record does not exist', 400, false);
    
    case '23502': // Not null violation
      return new AppError(ErrorType.VALIDATION, 'Required field is missing', 400, false);
    
    case 'PGRST301': // JWT expired
      return new AppError(ErrorType.AUTHENTICATION, 'Session expired. Please log in again.', 401, false);
    
    default:
      // Check if it's a connection error (retryable)
      if (message.includes('connection') || message.includes('timeout')) {
        return new AppError(ErrorType.DATABASE, 'Database connection error. Please try again.', 503, true);
      }
      
      return new AppError(ErrorType.DATABASE, message, 500, false);
  }
}

/**
 * Handle Gemini API errors
 */
export function handleGeminiError(error: any): AppError {
  const message = error.message || 'AI service error';

  if (message.includes('API key')) {
    return new AppError(ErrorType.CONFIGURATION, 'AI service is not properly configured', 503, false);
  }

  if (message.includes('timeout') || message.includes('Request timeout')) {
    return new AppError(ErrorType.TIMEOUT, 'AI service took too long to respond. Please try again.', 504, true);
  }

  if (message.includes('rate limit') || message.includes('quota')) {
    return new AppError(ErrorType.AI_SERVICE, 'AI service rate limit reached. Please try again later.', 429, true);
  }

  if (message.includes('network') || message.includes('fetch')) {
    return new AppError(ErrorType.NETWORK, 'Network error connecting to AI service', 503, true);
  }

  return new AppError(ErrorType.AI_SERVICE, 'Failed to generate insights. Please try again later.', 500, true);
}
