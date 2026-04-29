import type { HttpClient } from '../http.js';
import type {
  Tenant,
  TenantListParams,
  TenantCreateData,
  TenantUpdateData,
  PagedResponse,
} from '../types/index.js';

/**
 * Tenants resource for managing client organizations in ImmyBot
 */
export class TenantsResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List tenants with optional filtering
   */
  async list(params?: TenantListParams): Promise<Tenant[]> {
    const response = await this.httpClient.request<Tenant[] | PagedResponse<Tenant>>(
      '/tenants',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific tenant by ID
   */
  async get(id: number): Promise<Tenant> {
    return this.httpClient.request<Tenant>(`/tenants/${id}`);
  }

  /**
   * Search tenants by name
   */
  async search(query: string): Promise<Tenant[]> {
    return this.list({
      search: query,
    });
  }

  /**
   * Create a new tenant
   */
  async create(data: TenantCreateData): Promise<Tenant> {
    return this.httpClient.request<Tenant>('/tenants', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing tenant
   */
  async update(id: number, data: TenantUpdateData): Promise<Tenant> {
    return this.httpClient.request<Tenant>(`/tenants/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete a tenant
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get tenant statistics
   */
  async getStats(id: number): Promise<{
    computerCount: number;
    activeComputerCount: number;
    softwareCount: number;
    deploymentCount: number;
    lastMaintenanceSession?: string;
  }> {
    return this.httpClient.request(`/tenants/${id}/stats`);
  }

  /**
   * Get computers for a tenant
   */
  async getComputers(id: number): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/tenants/${id}/computers`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get deployments for a tenant
   */
  async getDeployments(id: number): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/tenants/${id}/deployments`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get maintenance sessions for a tenant
   */
  async getMaintenanceSessions(id: number, params?: { status?: string; limit?: number }): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/tenants/${id}/maintenance-sessions`,
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Enable or disable a tenant
   */
  async setStatus(id: number, status: 'Active' | 'Inactive'): Promise<Tenant> {
    return this.update(id, { status });
  }

  /**
   * Get tenant compliance dashboard data
   */
  async getComplianceDashboard(id: number): Promise<{
    totalComputers: number;
    compliantComputers: number;
    nonCompliantComputers: number;
    compliancePercentage: number;
    topNonCompliantSoftware: Array<{
      softwareName: string;
      nonCompliantCount: number;
    }>;
  }> {
    return this.httpClient.request(`/tenants/${id}/compliance`);
  }

  /**
   * Get tenant software inventory
   */
  async getSoftwareInventory(id: number): Promise<Array<{
    softwareName: string;
    version?: string;
    publisher?: string;
    installCount: number;
    lastSeen: string;
  }>> {
    return this.httpClient.request(`/tenants/${id}/software-inventory`);
  }

  /**
   * Update tenant maintenance windows
   */
  async updateMaintenanceWindows(id: number, windows: any[]): Promise<Tenant> {
    return this.update(id, {
      settings: {
        maintenanceWindows: windows,
      } as any,
    });
  }

  /**
   * Get tenant backup/export data
   */
  async exportConfiguration(id: number): Promise<any> {
    return this.httpClient.request(`/tenants/${id}/export`, {
      method: 'POST',
    });
  }
}