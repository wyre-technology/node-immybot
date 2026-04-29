import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Deployment configuration in ImmyBot
 * Represents desired state for software on computers/tenants
 */
export interface Deployment extends BaseEntity {
  name: string;
  description?: string;
  softwareId: number;
  targetType: DeploymentTargetType;
  targetId: number;
  desiredState: DesiredState;
  autoUpdate: boolean;
  installDuringMaintenanceSession: boolean;
  installOutsideMaintenanceSession: boolean;
  status: Status;
  priority: number;
  conditions?: DeploymentCondition[];
  schedule?: DeploymentSchedule;
}

/**
 * Target types for deployments
 */
export type DeploymentTargetType = 'Computer' | 'Tenant' | 'Group';

/**
 * Desired software state
 */
export type DesiredState = 'Installed' | 'Uninstalled' | 'Updated' | 'Ignored';

/**
 * Deployment condition
 */
export interface DeploymentCondition {
  type: ConditionType;
  operator: ConditionOperator;
  value: string;
}

/**
 * Condition types
 */
export type ConditionType =
  | 'OperatingSystem'
  | 'OperatingSystemVersion'
  | 'ComputerName'
  | 'Domain'
  | 'InstalledSoftware'
  | 'RegistryKey'
  | 'FileExists'
  | 'PowerShellScript';

/**
 * Condition operators
 */
export type ConditionOperator =
  | 'Equals'
  | 'NotEquals'
  | 'Contains'
  | 'NotContains'
  | 'StartsWith'
  | 'EndsWith'
  | 'Exists'
  | 'NotExists'
  | 'GreaterThan'
  | 'LessThan';

/**
 * Deployment schedule
 */
export interface DeploymentSchedule {
  startDate?: string;
  endDate?: string;
  maintenanceWindowsOnly: boolean;
  allowOutsideBusinessHours: boolean;
}

/**
 * Deployment search/filter parameters
 */
export interface DeploymentListParams extends SieveParams {
  /** Filter by software ID */
  softwareId?: number;
  /** Filter by target type */
  targetType?: DeploymentTargetType;
  /** Filter by target ID */
  targetId?: number;
  /** Filter by desired state */
  desiredState?: DesiredState;
  /** Filter by status */
  status?: Status;
}

/**
 * Deployment creation data
 */
export interface DeploymentCreateData {
  name: string;
  description?: string;
  softwareId: number;
  targetType: DeploymentTargetType;
  targetId: number;
  desiredState: DesiredState;
  autoUpdate?: boolean;
  installDuringMaintenanceSession?: boolean;
  installOutsideMaintenanceSession?: boolean;
  priority?: number;
  conditions?: DeploymentCondition[];
  schedule?: DeploymentSchedule;
}

/**
 * Deployment update data
 */
export interface DeploymentUpdateData {
  name?: string;
  description?: string;
  desiredState?: DesiredState;
  autoUpdate?: boolean;
  installDuringMaintenanceSession?: boolean;
  installOutsideMaintenanceSession?: boolean;
  status?: Status;
  priority?: number;
}