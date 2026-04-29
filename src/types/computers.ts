import type { BaseEntity, SieveParams, Status, OperatingSystemType } from './common.js';

/**
 * Computer (device) in ImmyBot
 */
export interface Computer extends BaseEntity {
  name: string;
  serialNumber?: string;
  macAddress?: string;
  ipAddress?: string;
  operatingSystem: OperatingSystemType;
  operatingSystemVersion?: string;
  domain?: string;
  workgroup?: string;
  lastSeen?: string;
  status: Status;
  tenantId: number;
  primaryUserId?: number;
  description?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  isOnline: boolean;
  agentVersion?: string;
  timezone?: string;
}

/**
 * Computer inventory data
 */
export interface ComputerInventory extends BaseEntity {
  computerId: number;
  inventoryType: string;
  data: Record<string, unknown>;
  collectedAt: string;
}

/**
 * Computer search/filter parameters
 */
export interface ComputerListParams extends SieveParams {
  /** Filter by tenant ID */
  tenantId?: number;
  /** Filter by online status */
  isOnline?: boolean;
  /** Filter by operating system */
  operatingSystem?: OperatingSystemType;
  /** Filter by status */
  status?: Status;
}

/**
 * Computer creation data
 */
export interface ComputerCreateData {
  name: string;
  tenantId: number;
  serialNumber?: string;
  macAddress?: string;
  description?: string;
  location?: string;
}

/**
 * Computer update data
 */
export interface ComputerUpdateData {
  name?: string;
  description?: string;
  location?: string;
  primaryUserId?: number;
}