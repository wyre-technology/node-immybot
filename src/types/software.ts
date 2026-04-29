import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Software package in ImmyBot (also called "apps")
 */
export interface Software extends BaseEntity {
  name: string;
  displayName?: string;
  description?: string;
  publisher?: string;
  category?: string;
  isGlobal: boolean;
  status: Status;
  iconUrl?: string;
  websiteUrl?: string;
  supportUrl?: string;
  installationMethod: InstallationMethod;
  uninstallMethod: UninstallMethod;
  requiresReboot: boolean;
  architecture?: SoftwareArchitecture;
  minimumOsVersion?: string;
  maximumOsVersion?: string;
}

/**
 * Software version
 */
export interface SoftwareVersion extends BaseEntity {
  softwareId: number;
  version: string;
  displayVersion?: string;
  releaseDate?: string;
  isLatest: boolean;
  status: Status;
  downloadUrl?: string;
  installParameters?: string;
  uninstallParameters?: string;
  releaseNotes?: string;
}

/**
 * Installation methods
 */
export type InstallationMethod =
  | 'MSI'
  | 'EXE'
  | 'PowerShell'
  | 'Chocolatey'
  | 'Winget'
  | 'Script'
  | 'Manual';

/**
 * Uninstallation methods
 */
export type UninstallMethod =
  | 'MSI'
  | 'EXE'
  | 'PowerShell'
  | 'ControlPanel'
  | 'Script'
  | 'Manual';

/**
 * Software architecture
 */
export type SoftwareArchitecture = 'x86' | 'x64' | 'ARM64' | 'Any';

/**
 * Software search/filter parameters
 */
export interface SoftwareListParams extends SieveParams {
  /** Filter by global availability */
  isGlobal?: boolean;
  /** Filter by status */
  status?: Status;
  /** Filter by category */
  category?: string;
  /** Filter by publisher */
  publisher?: string;
  /** Search by name */
  search?: string;
}

/**
 * Software creation data
 */
export interface SoftwareCreateData {
  name: string;
  displayName?: string;
  description?: string;
  publisher?: string;
  category?: string;
  installationMethod: InstallationMethod;
  uninstallMethod: UninstallMethod;
  requiresReboot?: boolean;
  architecture?: SoftwareArchitecture;
}

/**
 * Software update data
 */
export interface SoftwareUpdateData {
  displayName?: string;
  description?: string;
  category?: string;
  status?: Status;
  requiresReboot?: boolean;
}