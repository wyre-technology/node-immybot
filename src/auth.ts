import type { ImmyBotConfig, TokenResponse, CachedToken } from './config.js';
import { AuthenticationError } from './errors.js';

/**
 * OAuth 2.0 client credentials authenticator for Microsoft Entra ID
 *
 * ImmyBot uses Microsoft Entra ID (Azure AD) for authentication with OAuth 2.0
 * client credentials flow. The scope format is api://{client_id}/.default
 * based on standard Microsoft practices for application permissions.
 */
export class ImmyBotAuth {
  private cachedToken: CachedToken | null = null;

  constructor(private readonly config: ImmyBotConfig) {}

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now() + 60000) {
      return this.cachedToken.accessToken;
    }

    // Fetch new token
    const token = await this.fetchToken();
    this.cachedToken = {
      accessToken: token.access_token,
      expiresAt: Date.now() + (token.expires_in * 1000),
    };

    return token.access_token;
  }

  /**
   * Fetch a new OAuth token from Microsoft Entra ID
   */
  private async fetchToken(): Promise<TokenResponse> {
    const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;

    // Scope format: api://{client_id}/.default
    // This is the standard pattern for Microsoft application permissions
    const scope = `api://${this.config.clientId}/.default`;

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.config.userAgent || 'wyre-technology/node-immybot',
      },
      body: body.toString(),
      signal: AbortSignal.timeout(this.config.timeout || 30000),
    });

    // Read response body as text first to avoid "body already read" errors
    const responseText = await response.text();
    let responseData: unknown;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (!response.ok) {
      const error = responseData as any;
      const message = error?.error_description || error?.error || 'Authentication failed';
      throw new AuthenticationError(`OAuth token request failed: ${message}`, responseData);
    }

    const token = responseData as TokenResponse;

    // Validate required fields
    if (!token.access_token || !token.expires_in) {
      throw new AuthenticationError('Invalid token response from Microsoft Entra ID', responseData);
    }

    return token;
  }

  /**
   * Clear cached token (force refresh on next request)
   */
  clearToken(): void {
    this.cachedToken = null;
  }

  /**
   * Check if we have a potentially valid cached token
   */
  hasValidToken(): boolean {
    return this.cachedToken !== null && this.cachedToken.expiresAt > Date.now();
  }
}