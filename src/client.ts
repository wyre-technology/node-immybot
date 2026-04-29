import type { ImmyBotConfig } from './config.js';
import { HttpClient } from './http.js';

// Resource imports
import { ComputersResource } from './resources/computers.js';
import { SoftwareResource } from './resources/software.js';
import { DeploymentsResource } from './resources/deployments.js';
import { ScriptsResource } from './resources/scripts.js';
import { TenantsResource } from './resources/tenants.js';
import { MaintenanceSessionsResource } from './resources/maintenance-sessions.js';
import { TasksResource } from './resources/tasks.js';

/**
 * Main ImmyBot API client
 *
 * Provides access to all ImmyBot API resources with OAuth 2.0 authentication
 * via Microsoft Entra ID. Each MSP tenant has their own subdomain and
 * Entra application registration.
 */
export class ImmyBotClient {
  private readonly httpClient: HttpClient;

  // Resource instances (lazy-loaded)
  private _computers?: ComputersResource;
  private _software?: SoftwareResource;
  private _deployments?: DeploymentsResource;
  private _scripts?: ScriptsResource;
  private _tenants?: TenantsResource;
  private _maintenanceSessions?: MaintenanceSessionsResource;
  private _tasks?: TasksResource;

  constructor(config: ImmyBotConfig) {
    this.httpClient = new HttpClient(config);
  }

  /**
   * Access to computers (devices) management
   */
  get computers(): ComputersResource {
    if (!this._computers) {
      this._computers = new ComputersResource(this.httpClient);
    }
    return this._computers;
  }

  /**
   * Access to software (applications) management
   */
  get software(): SoftwareResource {
    if (!this._software) {
      this._software = new SoftwareResource(this.httpClient);
    }
    return this._software;
  }

  /**
   * Access to deployment configurations management
   */
  get deployments(): DeploymentsResource {
    if (!this._deployments) {
      this._deployments = new DeploymentsResource(this.httpClient);
    }
    return this._deployments;
  }

  /**
   * Access to scripts management and execution
   */
  get scripts(): ScriptsResource {
    if (!this._scripts) {
      this._scripts = new ScriptsResource(this.httpClient);
    }
    return this._scripts;
  }

  /**
   * Access to tenant (client organization) management
   */
  get tenants(): TenantsResource {
    if (!this._tenants) {
      this._tenants = new TenantsResource(this.httpClient);
    }
    return this._tenants;
  }

  /**
   * Access to maintenance sessions management
   */
  get maintenanceSessions(): MaintenanceSessionsResource {
    if (!this._maintenanceSessions) {
      this._maintenanceSessions = new MaintenanceSessionsResource(this.httpClient);
    }
    return this._maintenanceSessions;
  }

  /**
   * Access to background tasks monitoring
   */
  get tasks(): TasksResource {
    if (!this._tasks) {
      this._tasks = new TasksResource(this.httpClient);
    }
    return this._tasks;
  }

  /**
   * Test API connectivity and authentication
   */
  async testConnection(): Promise<{
    connected: boolean;
    instanceSubdomain: string;
    authenticated: boolean;
    userInfo?: any;
    version?: string;
  }> {
    try {
      // Try to get instance info or health check
      const response = await this.httpClient.request<any>('/health');

      return {
        connected: true,
        instanceSubdomain: this.httpClient['config'].instanceSubdomain,
        authenticated: true,
        userInfo: response.user,
        version: response.version,
      };
    } catch (error: any) {
      return {
        connected: false,
        instanceSubdomain: this.httpClient['config'].instanceSubdomain,
        authenticated: error.statusCode !== 401,
      };
    }
  }

  /**
   * Get API version and instance information
   */
  async getInstanceInfo(): Promise<{
    version: string;
    instance: string;
    timezone: string;
    features: string[];
  }> {
    return this.httpClient.request<any>('/instance-info');
  }

  /**
   * Clear cached authentication token (force refresh)
   */
  clearAuthCache(): void {
    this.httpClient['auth'].clearToken();
  }

  /**
   * Check if client has a valid cached token
   */
  isAuthenticated(): boolean {
    return this.httpClient['auth'].hasValidToken();
  }
}