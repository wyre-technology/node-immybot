import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Background task/operation in ImmyBot
 */
export interface Task extends BaseEntity {
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; // 0-100
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  result?: TaskResult;
  parentTaskId?: number;
  computerId?: number;
  tenantId?: number;
  userId?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Task types
 */
export type TaskType =
  | 'SoftwareInstallation'
  | 'SoftwareUninstallation'
  | 'ScriptExecution'
  | 'InventoryCollection'
  | 'MaintenanceSession'
  | 'SystemReboot'
  | 'AgentUpdate'
  | 'PolicyApplication'
  | 'DataSync'
  | 'Backup'
  | 'Import'
  | 'Export';

/**
 * Task execution status
 */
export type TaskStatus =
  | 'Queued'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Cancelled'
  | 'Paused'
  | 'TimedOut'
  | 'Retrying';

/**
 * Task priority levels
 */
export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Critical';

/**
 * Task execution result
 */
export interface TaskResult {
  success: boolean;
  exitCode?: number;
  output?: string;
  errorOutput?: string;
  warnings?: string[];
  details?: Record<string, unknown>;
}

/**
 * Task search/filter parameters
 */
export interface TaskListParams extends SieveParams {
  /** Filter by task type */
  type?: TaskType;
  /** Filter by status */
  status?: TaskStatus;
  /** Filter by priority */
  priority?: TaskPriority;
  /** Filter by computer ID */
  computerId?: number;
  /** Filter by tenant ID */
  tenantId?: number;
  /** Filter by user ID */
  userId?: number;
  /** Filter by parent task ID */
  parentTaskId?: number;
  /** Filter by date range */
  startDate?: string;
  endDate?: string;
}

/**
 * Task creation data
 */
export interface TaskCreateData {
  name: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  computerId?: number;
  tenantId?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Task control data
 */
export interface TaskControlData {
  action: TaskAction;
  reason?: string;
}

/**
 * Task control actions
 */
export type TaskAction = 'Start' | 'Pause' | 'Resume' | 'Cancel' | 'Retry';

/**
 * Task queue statistics
 */
export interface TaskQueueStats {
  totalTasks: number;
  queuedTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageWaitTimeMinutes: number;
  averageExecutionTimeMinutes: number;
}