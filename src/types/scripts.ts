import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Script in ImmyBot for automation and custom actions
 */
export interface Script extends BaseEntity {
  name: string;
  description?: string;
  category?: string;
  scriptType: ScriptType;
  language: ScriptLanguage;
  content: string;
  parameters?: ScriptParameter[];
  isGlobal: boolean;
  status: Status;
  requiresElevation: boolean;
  timeoutMinutes: number;
  author?: string;
  version?: string;
}

/**
 * Script types
 */
export type ScriptType =
  | 'Detection'
  | 'Installation'
  | 'Uninstallation'
  | 'Configuration'
  | 'Maintenance'
  | 'Diagnostic'
  | 'Custom';

/**
 * Script languages
 */
export type ScriptLanguage = 'PowerShell' | 'Batch' | 'Python' | 'JavaScript';

/**
 * Script parameter definition
 */
export interface ScriptParameter {
  name: string;
  description?: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: string;
  validValues?: string[];
}

/**
 * Parameter types
 */
export type ParameterType = 'String' | 'Integer' | 'Boolean' | 'Choice' | 'MultiChoice';

/**
 * Script execution request
 */
export interface ScriptExecutionRequest {
  computerId: number;
  parameters?: Record<string, unknown>;
  timeoutMinutes?: number;
  runAsSystem?: boolean;
}

/**
 * Script execution result
 */
export interface ScriptExecutionResult extends BaseEntity {
  scriptId: number;
  computerId: number;
  status: ExecutionStatus;
  exitCode?: number;
  output?: string;
  errorOutput?: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  parameters?: Record<string, unknown>;
}

/**
 * Script execution status
 */
export type ExecutionStatus =
  | 'Queued'
  | 'Running'
  | 'Completed'
  | 'Failed'
  | 'Cancelled'
  | 'TimedOut';

/**
 * Script search/filter parameters
 */
export interface ScriptListParams extends SieveParams {
  /** Filter by script type */
  scriptType?: ScriptType;
  /** Filter by language */
  language?: ScriptLanguage;
  /** Filter by global availability */
  isGlobal?: boolean;
  /** Filter by status */
  status?: Status;
  /** Filter by category */
  category?: string;
  /** Search by name */
  search?: string;
}

/**
 * Script creation data
 */
export interface ScriptCreateData {
  name: string;
  description?: string;
  category?: string;
  scriptType: ScriptType;
  language: ScriptLanguage;
  content: string;
  parameters?: ScriptParameter[];
  requiresElevation?: boolean;
  timeoutMinutes?: number;
}

/**
 * Script update data
 */
export interface ScriptUpdateData {
  name?: string;
  description?: string;
  category?: string;
  content?: string;
  parameters?: ScriptParameter[];
  status?: Status;
  requiresElevation?: boolean;
  timeoutMinutes?: number;
}