/**
 * ImmyBot client configuration
 */
export interface ImmyBotConfig {
  /** ImmyBot instance subdomain (e.g., 'acmemsp' for acmemsp.immy.bot) */
  instanceSubdomain: string;
  /** Microsoft Entra tenant ID */
  tenantId: string;
  /** Microsoft Entra application (client) ID */
  clientId: string;
  /** Microsoft Entra client secret */
  clientSecret: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** User-Agent string for requests */
  userAgent?: string;
  /** Rate limiter configuration */
  rateLimiter?: RateLimiterConfig;
}

/**
 * OAuth token response from Microsoft Entra
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

/**
 * Cached token with expiration tracking
 */
export interface CachedToken {
  accessToken: string;
  expiresAt: number; // Unix timestamp
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  /** Maximum requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  timeout: 30000,
  userAgent: 'wyre-technology/node-immybot',
  rateLimiter: {
    maxRequests: 100, // Conservative default - exact limits undocumented
    windowMs: 60000,  // 1 minute window
  },
} as const;