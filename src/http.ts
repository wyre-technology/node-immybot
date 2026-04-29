import type { ImmyBotConfig } from './config.js';
import { ImmyBotAuth } from './auth.js';
import { TokenBucketRateLimiter } from './rate-limiter.js';
import { DEFAULT_CONFIG } from './config.js';
import {
  ServiceError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from './errors.js';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * HTTP client for ImmyBot API with authentication, rate limiting, and error handling
 */
export class HttpClient {
  private readonly auth: ImmyBotAuth;
  private readonly rateLimiter: TokenBucketRateLimiter;
  private readonly baseUrl: string;

  constructor(private readonly config: ImmyBotConfig) {
    this.auth = new ImmyBotAuth(config);
    this.rateLimiter = new TokenBucketRateLimiter(
      config.rateLimiter || DEFAULT_CONFIG.rateLimiter
    );
    // Base URL constructed from instanceSubdomain (must end with slash for relative URL resolution)
    this.baseUrl = `https://${config.instanceSubdomain}.immy.bot/api/v1/`;
  }

  /**
   * Make an authenticated HTTP request
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Normalize endpoint to have trailing slash (prevents redirects that strip auth)
    const normalizedEndpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';

    await this.rateLimiter.waitForToken();

    const url = this.buildUrl(normalizedEndpoint, options.params);
    const accessToken = await this.auth.getAccessToken();

    const requestInit: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': this.config.userAgent || DEFAULT_CONFIG.userAgent,
        'Accept': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout || DEFAULT_CONFIG.timeout),
    };

    if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
      requestInit.headers = {
        ...requestInit.headers,
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, requestInit);
    return this.handleResponse<T>(response, endpoint, options);
  }

  /**
   * Handle response with safe error body reading
   * CRITICAL: Read text first, then JSON.parse to avoid "body already read" errors
   */
  private async handleResponse<T>(
    response: Response,
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    // Success cases
    if (response.ok) {
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
      }

      return {} as T;
    }

    // Error cases - read body safely
    let responseBody: unknown;
    const rawText = await response.text();

    try {
      responseBody = JSON.parse(rawText);
    } catch {
      responseBody = rawText;
    }

    // Handle specific error cases
    switch (response.status) {
      case 401:
        // Clear cached token and retry once
        this.auth.clearToken();
        if (options.method === 'GET' && !options.headers?.['X-Retry-Count']) {
          return this.request<T>(endpoint, {
            ...options,
            headers: { ...options.headers, 'X-Retry-Count': '1' },
          });
        }
        throw new AuthenticationError('Authentication failed', responseBody);

      case 403:
        throw new ForbiddenError('Access forbidden', responseBody);

      case 404:
        throw new NotFoundError('Resource not found', responseBody);

      case 400:
        // Try to extract validation errors
        const errors = this.extractValidationErrors(responseBody);
        throw new ValidationError('Request validation failed', errors, responseBody);

      case 429:
        const retryAfter = this.parseRetryAfter(response);
        // Wait and retry once with exponential backoff
        if (!options.headers?.['X-Retry-Count']) {
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return this.request<T>(endpoint, {
            ...options,
            headers: { ...options.headers, 'X-Retry-Count': '1' },
          });
        }
        throw new RateLimitError('Rate limit exceeded', retryAfter, responseBody);

      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError('Internal server error', responseBody);

      default:
        throw new ServiceError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          responseBody
        );
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    // Remove leading slash from endpoint to make it relative to baseUrl
    const relativeEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(relativeEndpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Parse Retry-After header (seconds or HTTP date)
   */
  private parseRetryAfter(response: Response): number {
    const retryAfter = response.headers.get('Retry-After');
    if (!retryAfter) return 60; // Default 1 minute

    // Try parsing as seconds first
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) return seconds;

    // Try parsing as HTTP date
    const date = new Date(retryAfter);
    if (!isNaN(date.getTime())) {
      return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
    }

    return 60; // Fallback
  }

  /**
   * Extract validation errors from response body
   */
  private extractValidationErrors(body: unknown): Array<{field: string; message: string}> {
    if (typeof body !== 'object' || body === null) return [];

    const errors: Array<{field: string; message: string}> = [];
    const responseObj = body as any;

    // Common error formats
    if (responseObj.errors && Array.isArray(responseObj.errors)) {
      responseObj.errors.forEach((error: any) => {
        errors.push({
          field: error.field || error.property || 'unknown',
          message: error.message || error.description || String(error),
        });
      });
    }

    if (responseObj.details && Array.isArray(responseObj.details)) {
      responseObj.details.forEach((detail: any) => {
        errors.push({
          field: detail.field || detail.property || 'unknown',
          message: detail.message || detail.description || String(detail),
        });
      });
    }

    return errors;
  }

  /**
   * Helper to unwrap API responses that may be wrapped in an envelope
   */
  static unwrapResponse<T>(response: T | Record<string, unknown>): T {
    if (typeof response === 'object' && response !== null && !Array.isArray(response)) {
      const keys = Object.keys(response);
      if (keys.length === 1) {
        const key = keys[0];
        const value = (response as Record<string, unknown>)[key];
        if (typeof value === 'object') {
          return value as T;
        }
      }
    }
    return response as T;
  }
}