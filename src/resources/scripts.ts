import type { HttpClient } from '../http.js';
import type {
  Script,
  ScriptExecutionRequest,
  ScriptExecutionResult,
  ScriptListParams,
  ScriptCreateData,
  ScriptUpdateData,
  PagedResponse,
} from '../types/index.js';

/**
 * Scripts resource for managing and executing PowerShell scripts
 */
export class ScriptsResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List scripts with optional filtering
   */
  async list(params?: ScriptListParams): Promise<Script[]> {
    const response = await this.httpClient.request<Script[] | PagedResponse<Script>>(
      '/scripts',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific script by ID
   */
  async get(id: number): Promise<Script> {
    return this.httpClient.request<Script>(`/scripts/${id}`);
  }

  /**
   * Search scripts by name
   */
  async search(query: string, params?: Omit<ScriptListParams, 'search'>): Promise<Script[]> {
    return this.list({
      ...params,
      search: query,
    });
  }

  /**
   * Create a new script
   */
  async create(data: ScriptCreateData): Promise<Script> {
    return this.httpClient.request<Script>('/scripts', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Update an existing script
   */
  async update(id: number, data: ScriptUpdateData): Promise<Script> {
    return this.httpClient.request<Script>(`/scripts/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * Delete a script
   */
  async delete(id: number): Promise<void> {
    await this.httpClient.request<void>(`/scripts/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Execute a script on a specific computer
   * WARNING: This is a destructive operation that runs code in SYSTEM context
   */
  async executeOnComputer(scriptId: number, request: ScriptExecutionRequest): Promise<ScriptExecutionResult> {
    return this.httpClient.request<ScriptExecutionResult>(`/scripts/${scriptId}/execute`, {
      method: 'POST',
      body: request,
    });
  }

  /**
   * Get script execution results
   */
  async getExecutionResults(scriptId: number): Promise<ScriptExecutionResult[]> {
    const response = await this.httpClient.request<ScriptExecutionResult[] | PagedResponse<ScriptExecutionResult>>(
      `/scripts/${scriptId}/executions`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific script execution result
   */
  async getExecutionResult(scriptId: number, executionId: number): Promise<ScriptExecutionResult> {
    return this.httpClient.request<ScriptExecutionResult>(`/scripts/${scriptId}/executions/${executionId}`);
  }

  /**
   * Cancel a running script execution
   */
  async cancelExecution(scriptId: number, executionId: number): Promise<void> {
    await this.httpClient.request<void>(`/scripts/${scriptId}/executions/${executionId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Get script categories
   */
  async getCategories(): Promise<string[]> {
    return this.httpClient.request<string[]>('/scripts/categories');
  }

  /**
   * Validate script syntax
   */
  async validateSyntax(scriptContent: string, language: string = 'PowerShell'): Promise<{
    valid: boolean;
    errors?: string[];
  }> {
    return this.httpClient.request('/scripts/validate', {
      method: 'POST',
      body: { content: scriptContent, language },
    });
  }

  /**
   * Get script execution history for a computer
   */
  async getExecutionHistoryForComputer(computerId: number): Promise<ScriptExecutionResult[]> {
    const response = await this.httpClient.request<ScriptExecutionResult[] | PagedResponse<ScriptExecutionResult>>(
      `/computers/${computerId}/script-executions`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get global scripts (available to all tenants)
   */
  async listGlobal(): Promise<Script[]> {
    return this.list({ isGlobal: true });
  }

  /**
   * Clone an existing script
   */
  async clone(id: number, newName: string): Promise<Script> {
    return this.httpClient.request<Script>(`/scripts/${id}/clone`, {
      method: 'POST',
      body: { name: newName },
    });
  }
}