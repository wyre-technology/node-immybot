import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Maintenance session in ImmyBot
 * Sessions reconcile desired state by installing/removing software
 */
export interface MaintenanceSession extends BaseEntity {
  name?: string;
  computerId: number;
  tenantId: number;
  status: MaintenanceSessionStatus;
  sessionType: MaintenanceSessionType;
  startedAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  rebootRequired: boolean;
  rebootCompleted: boolean;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  skippedTasks: number;
  progress: number; // 0-100
  currentTask?: string;
  logs?: MaintenanceLog[];
  results?: MaintenanceResult[];
}

/**
 * Maintenance session status
 */
export type MaintenanceSessionStatus =
  | 'Scheduled'
  | 'Queued'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Cancelled'
  | 'Paused';

/**
 * Maintenance session type
 */
export type MaintenanceSessionType =
  | 'Automated'
  | 'Manual'
  | 'OnDemand'
  | 'Emergency'
  | 'Compliance';

/**
 * Maintenance session log entry
 */
export interface MaintenanceLog extends BaseEntity {
  maintenanceSessionId: number;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Log levels for maintenance sessions
 */
export type LogLevel = 'Trace' | 'Debug' | 'Info' | 'Warn' | 'Error' | 'Fatal';

/**
 * Maintenance session result
 */
export interface MaintenanceResult extends BaseEntity {
  maintenanceSessionId: number;
  taskType: MaintenanceTaskType;
  taskName: string;
  status: MaintenanceTaskStatus;
  softwareId?: number;
  deploymentId?: number;
  scriptId?: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  exitCode?: number;
  output?: string;
  errorOutput?: string;
}

/**
 * Maintenance task types
 */
export type MaintenanceTaskType =
  | 'SoftwareInstall'
  | 'SoftwareUninstall'
  | 'SoftwareUpdate'
  | 'ScriptExecution'
  | 'SystemReboot'
  | 'ConfigurationChange'
  | 'InventoryCollection';

/**
 * Maintenance task execution status
 */
export type MaintenanceTaskStatus =
  | 'Pending'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Skipped'
  | 'Cancelled'
  | 'TimedOut';

/**
 * Maintenance session search/filter parameters
 */
export interface MaintenanceSessionListParams extends SieveParams {
  /** Filter by computer ID */
  computerId?: number;
  /** Filter by tenant ID */
  tenantId?: number;
  /** Filter by status */
  status?: MaintenanceSessionStatus;
  /** Filter by session type */
  sessionType?: MaintenanceSessionType;
  /** Filter by date range */
  startDate?: string;
  endDate?: string;
}

/**
 * Maintenance session creation/trigger data
 */
export interface MaintenanceSessionCreateData {
  computerId: number;
  sessionType?: MaintenanceSessionType;
  name?: string;
  allowReboot?: boolean;
  priority?: number;
  scheduledFor?: string; // ISO datetime
}

/**
 * Maintenance session control data
 */
export interface MaintenanceSessionControlData {
  action: MaintenanceAction;
  reason?: string;
}

/**
 * Maintenance session actions
 */
export type MaintenanceAction = 'Start' | 'Pause' | 'Resume' | 'Cancel' | 'ForceComplete';

/**
 * Maintenance session summary
 */
export interface MaintenanceSessionSummary {
  totalSessions: number;
  completedSessions: number;
  failedSessions: number;
  runningSessions: number;
  averageDurationMinutes: number;
  successRate: number;
}