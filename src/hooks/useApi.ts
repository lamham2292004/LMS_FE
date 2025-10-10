import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '@/lib/api-client';

interface UseApiOptions {
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { retries = 3, retryDelay = 1000, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await apiFunction(...args);
        
        if (response.data) {
          setData(response.data);
          onSuccess?.(response.data);
          return response.data;
        } else {
          throw new Error(response.message || 'No data received');
        }
      } catch (err: any) {
        lastError = err;
        console.error(`API attempt ${attempt + 1} failed:`, err);

        // Don't retry on certain errors
        if (err.message?.includes('401') || err.message?.includes('403')) {
          break;
        }

        // Wait before retrying (except on last attempt)
        if (attempt < retries) {
          await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    // All retries failed
    const errorMessage = lastError?.message || 'An unknown error occurred';
    setError(errorMessage);
    onError?.(lastError!);
    return null;
  }, [apiFunction, retries, retryDelay, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specific hooks for common API operations
export function useLogin() {
  return useApi(apiClient.login.bind(apiClient), {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

export function useGetProfile() {
  return useApi(apiClient.getProfile.bind(apiClient), {
    onSuccess: (data) => {
      console.log('Profile loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load profile:', error);
    },
  });
}

export function useGetStudents() {
  return useApi(apiClient.get.bind(apiClient), {
    onSuccess: (data) => {
      console.log('Students loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load students:', error);
    },
  });
}

export function useGetClasses() {
  return useApi(() => apiClient.get('/v1/classes'), {
    onSuccess: (data) => {
      console.log('Classes loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load classes:', error);
    },
  });
}

export function useGetDepartments() {
  return useApi(() => apiClient.get('/v1/departments'), {
    onSuccess: (data) => {
      console.log('Departments loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load departments:', error);
    },
  });
}