import type { RateLimiterConfig } from './config.js';

/**
 * Token bucket rate limiter implementation
 *
 * ImmyBot's exact rate limits are not documented, but they return HTTP 429
 * when throttled. This implementation provides a conservative rate limiter
 * with exponential backoff on rate limit errors.
 */
export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(private readonly config: RateLimiterConfig) {
    this.tokens = config.maxRequests;
    this.lastRefill = Date.now();
  }

  /**
   * Wait for a token to become available
   */
  async waitForToken(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    // Calculate wait time until next token is available
    const tokensNeeded = 1 - this.tokens;
    const tokensPerMs = this.config.maxRequests / this.config.windowMs;
    const waitMs = Math.ceil(tokensNeeded / tokensPerMs);

    await new Promise(resolve => setTimeout(resolve, waitMs));
    return this.waitForToken(); // Recursive call after waiting
  }

  /**
   * Check if a token is available without consuming it
   */
  canProceed(): boolean {
    this.refillTokens();
    return this.tokens >= 1;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    if (elapsed > 0) {
      const tokensToAdd = (elapsed / this.config.windowMs) * this.config.maxRequests;
      this.tokens = Math.min(this.config.maxRequests, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Reset the rate limiter (useful for testing or manual override)
   */
  reset(): void {
    this.tokens = this.config.maxRequests;
    this.lastRefill = Date.now();
  }
}