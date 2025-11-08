# Error Handling and Validation System

This document describes the comprehensive error handling and validation system implemented in FinBuddy.

## Overview

The error handling system provides:
- Standardized error types and responses
- Automatic retry logic for transient failures
- Toast notifications for user feedback
- Form validation with inline error displays
- Graceful handling of Supabase and Gemini API errors

## Components

### 1. Error Types (`lib/types.ts`)

**ErrorType Enum**: Categorizes errors for consistent handling
- `VALIDATION`: Input validation errors
- `AUTHENTICATION`: Auth failures (401)
- `AUTHORIZATION`: Permission errors (403)
- `NOT_FOUND`: Resource not found (404)
- `DATABASE`: Database operation errors
- `NETWORK`: Network connectivity issues
- `TIMEOUT`: Request timeout errors
- `AI_SERVICE`: Gemini API errors
- `CONFIGURATION`: Missing or invalid configuration
- `INTERNAL`: Unexpected server errors

**AppError Class**: Custom error class with additional metadata
- `type`: ErrorType enum value
- `message`: Human-readable error message
- `statusCode`: HTTP status code
- `isRetryable`: Whether the error can be retried

### 2. Error Utilities (`lib/errors.ts`)

**Key Functions**:

- `parseError(error)`: Extracts error message and retry status from any error type
- `isNetworkError(error)`: Detects network-related errors
- `isRetryableError(error)`: Determines if an error should trigger a retry
- `retryWithBackoff(fn, maxRetries, initialDelay)`: Executes a function with exponential backoff
- `handleSupabaseError(error)`: Converts Supabase errors to AppError
- `handleGeminiError(error)`: Converts Gemini API errors to AppError

**Retry Logic**:
- Automatic retry for network errors, timeouts, and 5xx server errors
- Exponential backoff: 1s, 2s, 4s delays
- Maximum 3 retry attempts by default
- No retry for client errors (4xx)

### 3. Validation (`lib/validation.ts`)

**Validation Functions**:

- `validateExpenseInput(data)`: Validates expense form data
  - Amount: Required, positive number
  - Category: Required, must be from predefined list
  - Date: Required, valid ISO date format
  - Note: Optional string

- `validateProfileData(data)`: Validates profile updates
  - Name: Optional, max 100 characters
  - Currency: 3-letter ISO code (e.g., USD, EUR)

- `validateEmail(email)`: Email format validation
- `validatePassword(password)`: Password strength validation (min 6 chars)

**Helper Functions**:
- `hasValidationErrors(errors)`: Check if validation errors exist
- `getFirstValidationError(errors)`: Get first error message

### 4. Toast Notifications (`lib/toast.ts`, `components/Toast.tsx`)

**Toast Manager**:
```typescript
import { toast } from '@/lib/toast';

// Show notifications
toast.success('Operation completed successfully');
toast.error('Something went wrong');
toast.warning('Please review your input');
toast.info('New feature available');

// Custom duration (default: 5000ms)
toast.success('Saved!', 3000);

// Dismiss specific toast
const id = toast.error('Error occurred');
toast.dismiss(id);

// Clear all toasts
toast.clear();
```

**Toast Types**:
- `success`: Green, checkmark icon
- `error`: Red, alert icon
- `warning`: Yellow, warning icon
- `info`: Blue, info icon

### 5. API Client (`lib/api-client.ts`)

**Enhanced Fetch with Retry**:
```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';

// GET request with automatic retry
const data = await apiGet('/api/expenses');

// POST with custom retry settings
const result = await apiPost('/api/expenses', expenseData, {
  retries: 3,
  retryDelay: 2000
});

// PUT and DELETE
await apiPut(`/api/expenses/${id}`, updates);
await apiDelete(`/api/expenses/${id}`);
```

## Usage Examples

### API Route Error Handling

```typescript
import { handleSupabaseError } from '@/lib/errors';
import { validateExpenseInput, hasValidationErrors } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const errors = validateExpenseInput(body);
    if (hasValidationErrors(errors)) {
      return NextResponse.json(
        { error: 'Validation Error', message: getFirstValidationError(errors) },
        { status: 400 }
      );
    }
    
    // Database operation
    const { data, error } = await supabase.from('expenses').insert(body);
    
    if (error) {
      const appError = handleSupabaseError(error);
      return NextResponse.json(
        { error: appError.type, message: appError.message },
        { status: appError.statusCode }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### Component Error Handling

```typescript
import { toast } from '@/lib/toast';
import { parseError } from '@/lib/errors';
import { retryWithBackoff } from '@/lib/errors';

async function handleSubmit() {
  try {
    // Use retry logic for API calls
    const result = await retryWithBackoff(async () => {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw Object.assign(new Error(error.message), {
          statusCode: response.status,
          isRetryable: error.isRetryable
        });
      }
      
      return response.json();
    });
    
    toast.success('Expense added successfully');
  } catch (error) {
    const { message, isRetryable } = parseError(error);
    toast.error(message);
    
    if (isRetryable) {
      // Show retry option
    }
  }
}
```

### Form Validation

```typescript
import { validateExpenseInput } from '@/lib/validation';
import { toast } from '@/lib/toast';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const errors = validateExpenseInput(formData);
  
  if (hasValidationErrors(errors)) {
    setErrors(errors);
    toast.error('Please fix the form errors');
    return;
  }
  
  // Submit form
};
```

## Error Response Format

All API routes return consistent error responses:

```typescript
{
  error: string;        // Error type (e.g., "Validation Error")
  message: string;      // Human-readable message
  statusCode?: number;  // HTTP status code
  isRetryable?: boolean; // Whether retry is recommended
  errors?: object;      // Validation errors by field
}
```

## Best Practices

1. **Always validate input** on both client and server
2. **Use toast notifications** for user feedback
3. **Implement retry logic** for network operations
4. **Handle specific error types** appropriately
5. **Log errors** for debugging (server-side only)
6. **Show user-friendly messages** (hide technical details)
7. **Provide retry options** for retryable errors
8. **Use optimistic updates** with rollback on error

## Testing Error Handling

To test error scenarios:

1. **Network errors**: Disconnect network during API call
2. **Validation errors**: Submit invalid form data
3. **Auth errors**: Make requests without authentication
4. **Database errors**: Test with invalid data or constraints
5. **Timeout errors**: Test with slow network conditions
6. **Rate limits**: Make rapid successive API calls

## Monitoring

Error handling includes comprehensive logging:
- All errors logged to console (server-side)
- Error types and messages tracked
- Retry attempts logged
- User-facing errors shown via toast notifications
