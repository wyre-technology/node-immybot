import type { HttpClient } from '../http.js';
import type {
  Computer,
  ComputerInventory,
  ComputerListParams,
  ComputerCreateData,
  ComputerUpdateData,
  PagedResponse,
} from '../types/index.js';

/**
 * Computers resource for managing devices in ImmyBot
 */
export class ComputersResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List computers with optional filtering and pagination
   */
  async list(params?: ComputerListParams): Promise<Computer[]> {
    const response = await this.httpClient.request<Computer[] | PagedResponse<Computer>>(
      '/computers',
      { params }
    );

    // Handle both direct array and paged response
    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific computer by ID
   */
  async get(id: number): Promise<Computer> {
    return this.httpClient.request<Computer>(`/computers/${id}`);
  }

  /**
   * Search computers using Sieve filters
   */
  async search(query: string, params?: Omit<ComputerListParams, 'filters'>): Promise<Computer[]> {
    return this.list({
      ...params,
      filters: `name@=*${query}*`,
    });
  }

  /**
   * Get computer inventory data
   */
  async getInventory(computerId: number): Promise<ComputerInventory[]> {
    const response = await this.httpClient.request<ComputerInventory[] | PagedResponse<ComputerInventory>>(
      `/computers/${computerId}/inventory`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Create a new computer record
   */
  async create(data: ComputerCreateData): Promise<Computer> {
    return this.httpClient.request<Computer>('/computers', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing computer
   */
  async update(id: number, data: ComputerUpdateData): Promise<Computer> {
    return this.httpClient.request<Computer>(`/computers/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete a computer (if supported by API)
   * Note: This may not be available in all ImmyBot configurations
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/computers/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get online status of computers
   */
  async getOnlineStatus(computerIds: number[]): Promise<Record<number, boolean>> {
    const response = await this.httpClient.request<Record<number, boolean>>(
      '/computers/online-status',
      {
        method: 'POST',
        body: { computerIds },
      }
    );

    return response;
  }

  /**
   * Trigger agent check-in for a computer
   */
  async triggerCheckIn(computerId: number): Promise<void> {
    await this.httpClient.request<void>(`/computers/${computerId}/check-in`, {
      method: 'POST',
    });
  }

  /**
   * Get computer deployment status
   */
  async getDeployments(computerId: number): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/computers/${computerId}/deployments`
    );

    return Array.isArray(response) ? response : response.items;
  }
}