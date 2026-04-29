import type { HttpClient } from '../http.js';
import type {
  MaintenanceSession,
  MaintenanceSessionListParams,
  MaintenanceSessionCreateData,
  MaintenanceSessionControlData,
  MaintenanceSessionSummary,
  PagedResponse,
} from '../types/index.js';

/**
 * Maintenance Sessions resource for managing device reconciliation sessions
 */
export class MaintenanceSessionsResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List maintenance sessions with optional filtering
   */
  async list(params?: MaintenanceSessionListParams): Promise<MaintenanceSession[]> {
    const response = await this.httpClient.request<MaintenanceSession[] | PagedResponse<MaintenanceSession>>(
      '/maintenance-sessions',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific maintenance session by ID
   */
  async get(id: number): Promise<MaintenanceSession> {
    return this.httpClient.request<MaintenanceSession>(`/maintenance-sessions/${id}`);
  }

  /**
   * Start/trigger a maintenance session on a computer
   * This reconciles the desired state by installing/removing software
   */
  async start(data: MaintenanceSessionCreateData): Promise<MaintenanceSession> {
    return this.httpClient.request<MaintenanceSession>('/run-immy-service', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Control a maintenance session (pause, resume, cancel)
   */
  async control(id: number, data: MaintenanceSessionControlData): Promise<MaintenanceSession> {
    return this.httpClient.request<MaintenanceSession>(`/maintenance-sessions/${id}/control`, {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Cancel a running maintenance session
   */
  async cancel(id: number, reason?: string): Promise<MaintenanceSession> {
    return this.control(id, {
      action: 'Cancel',
      reason,
    });
  }

  /**
   * Pause a running maintenance session
   */
  async pause(id: number, reason?: string): Promise<MaintenanceSession> {
    return this.control(id, {
      action: 'Pause',
      reason,
    });
  }

  /**
   * Resume a paused maintenance session
   */
  async resume(id: number): Promise<MaintenanceSession> {
    return this.control(id, {
      action: 'Resume',
    });
  }

  /**
   * Get maintenance session logs
   */
  async getLogs(id: number): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/maintenance-sessions/${id}/logs`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get maintenance session results/tasks
   */
  async getResults(id: number): Promise<any[]> {
    const response = await this.httpClient.request<any[] | PagedResponse<any>>(
      `/maintenance-sessions/${id}/results`
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get active maintenance sessions
   */
  async getActive(): Promise<MaintenanceSession[]> {
    return this.list({
      status: 'Running',
    });
  }

  /**
   * Get maintenance sessions for a specific computer
   */
  async getForComputer(computerId: number): Promise<MaintenanceSession[]> {
    return this.list({
      computerId,
    });
  }

  /**
   * Get maintenance sessions for a tenant
   */
  async getForTenant(tenantId: number): Promise<MaintenanceSession[]> {
    return this.list({
      tenantId,
    });
  }

  /**
   * Get maintenance session summary/statistics
   */
  async getSummary(params?: {
    tenantId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<MaintenanceSessionSummary> {
    return this.httpClient.request('/maintenance-sessions/summary', {
      params,
    });
  }

  /**
   * Schedule a maintenance session for later execution
   */
  async schedule(data: MaintenanceSessionCreateData & { scheduledFor: string }): Promise<MaintenanceSession> {
    return this.httpClient.request<MaintenanceSession>('/maintenance-sessions/schedule', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Get the next scheduled maintenance for a computer
   */
  async getNextScheduled(computerId: number): Promise<MaintenanceSession | null> {
    const response = await this.httpClient.request<MaintenanceSession | null>(
      `/computers/${computerId}/next-maintenance`
    );

    return response;
  }

  /**
   * Trigger maintenance for all computers in a tenant
   */
  async startForTenant(tenantId: number, sessionType: string = 'Manual'): Promise<MaintenanceSession[]> {
    return this.httpClient.request<MaintenanceSession[]>('/maintenance-sessions/start-tenant', {
      method: 'POST',
      body: {
        tenantId,
        sessionType,
      },
    });
  }

  /**
   * Get maintenance session performance metrics
   */
  async getMetrics(id: number): Promise<{
    duration: number;
    tasksCompleted: number;
    tasksFailed: number;
    averageTaskDuration: number;
    rebootRequired: boolean;
    totalDataTransferred?: number;
  }> {
    return this.httpClient.request(`/maintenance-sessions/${id}/metrics`);
  }
}