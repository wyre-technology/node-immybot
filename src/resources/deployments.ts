import type { HttpClient } from '../http.js';
import type {
  Deployment,
  DeploymentListParams,
  DeploymentCreateData,
  DeploymentUpdateData,
  PagedResponse,
} from '../types/index.js';

/**
 * Deployments resource for managing software deployment configurations
 */
export class DeploymentsResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List deployments with optional filtering
   */
  async list(params?: DeploymentListParams): Promise<Deployment[]> {
    const response = await this.httpClient.request<Deployment[] | PagedResponse<Deployment>>(
      '/deployments',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific deployment by ID
   */
  async get(id: number): Promise<Deployment> {
    return this.httpClient.request<Deployment>(`/deployments/${id}`);
  }

  /**
   * Create a new deployment configuration
   */
  async create(data: DeploymentCreateData): Promise<Deployment> {
    return this.httpClient.request<Deployment>('/deployments', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing deployment
   */
  async update(id: number, data: DeploymentUpdateData): Promise<Deployment> {
    return this.httpClient.request<Deployment>(`/deployments/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete a deployment
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/deployments/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Target software deployment to a specific computer
   */
  async targetComputer(data: {
    softwareId: number;
    computerId: number;
    desiredState: 'Installed' | 'Uninstalled' | 'Updated';
    autoUpdate?: boolean;
  }): Promise<Deployment> {
    return this.create({
      name: `Deploy to Computer ${data.computerId}`,
      softwareId: data.softwareId,
      targetType: 'Computer',
      targetId: data.computerId,
      desiredState: data.desiredState,
      autoUpdate: data.autoUpdate ?? false,
    });
  }

  /**
   * Target software deployment to all computers in a tenant
   */
  async targetTenant(data: {
    softwareId: number;
    tenantId: number;
    desiredState: 'Installed' | 'Uninstalled' | 'Updated';
    autoUpdate?: boolean;
  }): Promise<Deployment> {
    return this.create({
      name: `Deploy to Tenant ${data.tenantId}`,
      softwareId: data.softwareId,
      targetType: 'Tenant',
      targetId: data.tenantId,
      desiredState: data.desiredState,
      autoUpdate: data.autoUpdate ?? false,
    });
  }

  /**
   * Get deployments for a specific computer
   */
  async getForComputer(computerId: number): Promise<Deployment[]> {
    return this.list({
      targetType: 'Computer',
      targetId: computerId,
    });
  }

  /**
   * Get deployments for a specific tenant
   */
  async getForTenant(tenantId: number): Promise<Deployment[]> {
    return this.list({
      targetType: 'Tenant',
      targetId: tenantId,
    });
  }

  /**
   * Get deployments for a specific software package
   */
  async getForSoftware(softwareId: number): Promise<Deployment[]> {
    return this.list({ softwareId });
  }

  /**
   * Enable or disable a deployment
   */
  async setStatus(id: number, status: 'Active' | 'Inactive'): Promise<Deployment> {
    return this.update(id, { status });
  }

  /**
   * Get deployment compliance status
   */
  async getComplianceStatus(id: number): Promise<any> {
    return this.httpClient.request<any>(`/deployments/${id}/compliance`);
  }

  /**
   * Force deployment execution (trigger maintenance session)
   * Note: This stages the desired state - a maintenance session must run to reconcile
   */
  async trigger(id: number): Promise<void> {
    await this.httpClient.request<void>(`/deployments/${id}/trigger`, {
      method: 'POST',
    });
  }
}