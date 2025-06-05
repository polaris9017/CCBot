import { useState, useCallback, useEffect } from 'react';

export interface UpdateSettingData {
  activateBot?: boolean;
  activateUptime?: boolean;
  activateMemo?: boolean;
  activateFixedMessage?: boolean;
  activateCustomCommands?: boolean;
  customCommands?: Record<string, string> | null;
  activateChatOverlay?: boolean;
  chatOverlayDesign?: string;
  activateChatCustomDesign?: boolean;
  chatCustomDesignCode?: string | null;
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: UpdateSettingData | string;
  manual?: boolean; // 수동으로 트리거할지 여부
}

interface UseFetchResult<T> {
  response: T | null;
  loading: boolean;
  error: string | null;
  fetch: (overrideOptions?: Partial<FetchOptions>) => Promise<T | null>;
}

export default function useApi<T = any>(
  url: string,
  options: FetchOptions = {}
): UseFetchResult<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (overrideOptions: Partial<FetchOptions> = {}): Promise<T | null> => {
      if (!url) return null;

      const finalOptions = { ...options, ...overrideOptions };

      setLoading(true);
      setError(null);

      try {
        const fetchOptions: RequestInit = {
          method: finalOptions.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...finalOptions.headers,
          },
        };

        if (finalOptions.body && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method || 'GET')) {
          fetchOptions.body =
            typeof finalOptions.body === 'string'
              ? finalOptions.body
              : JSON.stringify(finalOptions.body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        let result: T;

        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          result = (await response.text()) as T;
        }

        setResponse(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  // manual이 false인 경우 자동으로 실행
  useEffect(() => {
    if (!options.manual) {
      execute();
    }
  }, [execute, options.manual]);

  return { response, loading, error, fetch: execute };
}
