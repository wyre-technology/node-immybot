import type { HttpClient } from '../http.js';
import type {
  Task,
  TaskListParams,
  TaskCreateData,
  TaskControlData,
  TaskQueueStats,
  PagedResponse,
} from '../types/index.js';

/**
 * Tasks resource for managing background operations and job status
 */
export class TasksResource {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * List tasks with optional filtering
   */
  async list(params?: TaskListParams): Promise<Task[]> {
    const response = await this.httpClient.request<Task[] | PagedResponse<Task>>(
      '/tasks',
      { params }
    );

    return Array.isArray(response) ? response : response.items;
  }

  /**
   * Get a specific task by ID
   */
  async get(id: number): Promise<Task> {
    return this.httpClient.request<Task>(`/tasks/${id}`);
  }

  /**
   * Create a new background task
   */
  async create(data: TaskCreateData): Promise<Task> {
    return this.httpClient.request<Task>('/tasks', {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Control a task (start, pause, resume, cancel, retry)
   */
  async control(id: number, data: TaskControlData): Promise<Task> {
    return this.httpClient.request<Task>(`/tasks/${id}/control`, {
      method: 'POST',
      body: data,
    });
  }

  /**
   * Cancel a task
   */
  async cancel(id: number, reason?: string): Promise<Task> {
    return this.control(id, {
      action: 'Cancel',
      reason,
    });
  }

  /**
   * Retry a failed task
   */
  async retry(id: number): Promise<Task> {
    return this.control(id, {
      action: 'Retry',
    });
  }

  /**
   * Get running tasks
   */
  async getRunning(): Promise<Task[]> {
    return this.list({
      status: 'Running',
    });
  }

  /**
   * Get queued tasks
   */
  async getQueued(): Promise<Task[]> {
    return this.list({
      status: 'Queued',
    });
  }

  /**
   * Get failed tasks
   */
  async getFailed(): Promise<Task[]> {
    return this.list({
      status: 'Failed',
    });
  }

  /**
   * Get tasks for a specific computer
   */
  async getForComputer(computerId: number): Promise<Task[]> {
    return this.list({
      computerId,
    });
  }

  /**
   * Get tasks for a tenant
   */
  async getForTenant(tenantId: number): Promise<Task[]> {
    return this.list({
      tenantId,
    });
  }

  /**
   * Get tasks by type
   */
  async getByType(type: string): Promise<Task[]> {
    return this.list({
      type: type as any,
    });
  }

  /**
   * Get task queue statistics
   */
  async getQueueStats(): Promise<TaskQueueStats> {
    return this.httpClient.request<TaskQueueStats>('/tasks/queue-stats');
  }

  /**
   * Get task execution history
   */
  async getHistory(params?: {
    computerId?: number;
    tenantId?: number;
    taskType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Task[]> {
    return this.list({
      ...params,
      status: 'Completed',
    });
  }

  /**
   * Get child tasks for a parent task
   */
  async getChildTasks(parentId: number): Promise<Task[]> {
    return this.list({
      parentTaskId: parentId,
    });
  }

  /**
   * Get task dependencies
   */
  async getDependencies(id: number): Promise<{
    dependsOn: Task[];
    dependents: Task[];
  }> {
    return this.httpClient.request(`/tasks/${id}/dependencies`);
  }

  /**
   * Bulk cancel tasks
   */
  async bulkCancel(taskIds: number[], reason?: string): Promise<Task[]> {
    return this.httpClient.request<Task[]>('/tasks/bulk-cancel', {
      method: 'POST',
      body: {
        taskIds,
        reason,
      },
    });
  }

  /**
   * Get task performance metrics
   */
  async getMetrics(id: number): Promise<{
    duration: number;
    cpuUsage?: number;
    memoryUsage?: number;
    networkUsage?: number;
    diskUsage?: number;
  }> {
    return this.httpClient.request(`/tasks/${id}/metrics`);
  }

  /**
   * Get task logs
   */
  async getLogs(id: number): Promise<Array<{
    timestamp: string;
    level: string;
    message: string;
    details?: any;
  }>> {
    return this.httpClient.request(`/tasks/${id}/logs`);
  }

  /**
   * Estimate task completion time
   */
  async getEstimatedCompletion(id: number): Promise<{
    estimatedCompletionTime: string;
    confidenceLevel: number;
    basedOnHistoricalData: boolean;
  }> {
    return this.httpClient.request(`/tasks/${id}/estimate`);
  }
}