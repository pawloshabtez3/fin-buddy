import { retryWithBackoff, isNetworkError } from './errors';

/**
 * API client with automatic retry logic for network errors
 */

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Enhanced fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 2, retryDelay = 1000, ...fetchOptions } = options;

  return retryWithBackoff(
    async () => {
      const response = await fetch(url, fetchOptions);
      
      // Don't retry on client errors (4xx), only on server errors (5xx) and network errors
      if (!response.ok && response.status >= 400 && response.status < 500) {
        throw Object.assign(new Error('Client error'), { 
          statusCode: response.status,
          response 
        });
      }
      
      return response;
    },
    retries,
    retryDelay
  );
}

/**
 * Make a GET request with retry logic
 */
export async function apiGet<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw Object.assign(new Error(error.message || 'Request failed'), {
      statusCode: response.status,
      ...error,
    });
  }

  return response.json();
}

/**
 * Make a POST request with retry logic
 */
export async function apiPost<T>(
  url: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw Object.assign(new Error(error.message || 'Request failed'), {
      statusCode: response.status,
      ...error,
    });
  }

  return response.json();
}

/**
 * Make a PUT request with retry logic
 */
export async function apiPut<T>(
  url: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw Object.assign(new Error(error.message || 'Request failed'), {
      statusCode: response.status,
      ...error,
    });
  }

  return response.json();
}

/**
 * Make a DELETE request with retry logic
 */
export async function apiDelete<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw Object.assign(new Error(error.message || 'Request failed'), {
      statusCode: response.status,
      ...error,
    });
  }

  return response.json();
}
