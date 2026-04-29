import type { HttpClient } from '../http.js';
import type {
  Software,
  SoftwareVersion,
  SoftwareListParams,
  SoftwareCreateData,
  SoftwareUpdateData,
  PagedResponse,
} from '../types/index.js';

/**
 * Software resource for managing applications/packages in ImmyBot
 */
export class SoftwareResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List global software packages
   */
  async listGlobal(params?: SoftwareListParams): Promise<Software[]> {
    const response = await this.httpClient.request<Software[] | PagedResponse<Software>>(
      '/software/global',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * List all software (global and tenant-specific)
   */
  async list(params?: SoftwareListParams): Promise<Software[]> {
    const response = await this.httpClient.request<Software[] | PagedResponse<Software>>(
      '/software',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific software package by ID
   */
  async get(id: number): Promise<Software> {
    return this.httpClient.request<Software>(`/software/${id}`);
  }

  /**
   * Search software packages by name
   */
  async search(query: string, params?: Omit<SoftwareListParams, 'search'>): Promise<Software[]> {
    return this.list({
      ...params,
      search: query,
    });
  }

  /**
   * List versions for a software package
   */
  async listVersions(softwareId: number): Promise<SoftwareVersion[]> {
    const response = await this.httpClient.request<SoftwareVersion[] | PagedResponse<SoftwareVersion>>(
      `/software/${softwareId}/versions`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific software version
   */
  async getVersion(softwareId: number, versionId: number): Promise<SoftwareVersion> {
    return this.httpClient.request<SoftwareVersion>(`/software/${softwareId}/versions/${versionId}`);
  }

  /**
   * Get the latest version of a software package
   */
  async getLatestVersion(softwareId: number): Promise<SoftwareVersion> {
    return this.httpClient.request<SoftwareVersion>(`/software/${softwareId}/versions/latest`);
  }

  /**
   * Create a new software package
   */
  async create(data: SoftwareCreateData): Promise<Software> {
    return this.httpClient.request<Software>('/software', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing software package
   */
  async update(id: number, data: SoftwareUpdateData): Promise<Software> {
    return this.httpClient.request<Software>(`/software/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete a software package
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/software/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get software categories
   */
  async getCategories(): Promise<string[]> {
    return this.httpClient.request<string[]>('/software/categories');
  }

  /**
   * Get software publishers
   */
  async getPublishers(): Promise<string[]> {
    return this.httpClient.request<string[]>('/software/publishers');
  }

  /**
   * Check for software updates
   */
  async checkForUpdates(softwareId: number): Promise<SoftwareVersion | null> {
    const response = await this.httpClient.request<SoftwareVersion | null>(
      `/software/${softwareId}/check-updates`,
      { method: 'POST' }
    );

    return response;
  }

  /**
   * Get software installation statistics
   */
  async getInstallationStats(softwareId: number): Promise<any> {
    return this.httpClient.request<any>(`/software/${softwareId}/stats`);
  }
}