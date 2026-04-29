import type { BaseEntity, SieveParams, Status } from './common.js';

/**
 * Tenant (client/organization) in ImmyBot
 */
export interface Tenant extends BaseEntity {
  name: string;
  displayName?: string;
  description?: string;
  status: Status;
  timeZone?: string;
  businessHours?: BusinessHours;
  maintenanceWindows?: MaintenanceWindow[];
  settings?: TenantSettings;
  contactInfo?: ContactInfo;
  billingInfo?: BillingInfo;
}

/**
 * Business hours configuration
 */
export interface BusinessHours {
  monday?: TimeWindow;
  tuesday?: TimeWindow;
  wednesday?: TimeWindow;
  thursday?: TimeWindow;
  friday?: TimeWindow;
  saturday?: TimeWindow;
  sunday?: TimeWindow;
  holidays?: Holiday[];
}

/**
 * Time window for business hours
 */
export interface TimeWindow {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  enabled: boolean;
}

/**
 * Holiday definition
 */
export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
  recurring: boolean;
}

/**
 * Maintenance window
 */
export interface MaintenanceWindow {
  id: string;
  name: string;
  description?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:MM format
  durationMinutes: number;
  enabled: boolean;
  allowReboots: boolean;
  maxConcurrentComputers?: number;
}

/**
 * Day of week enumeration
 */
export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

/**
 * Tenant-specific settings
 */
export interface TenantSettings {
  autoInstallUpdates: boolean;
  allowRebootsDuringBusinessHours: boolean;
  maintenanceSessionFrequency: MaintenanceFrequency;
  notificationSettings?: NotificationSettings;
  agentSettings?: AgentSettings;
}

/**
 * Maintenance session frequency
 */
export type MaintenanceFrequency = 'Daily' | 'Weekly' | 'BiWeekly' | 'Monthly' | 'OnDemand';

/**
 * Notification settings
 */
export interface NotificationSettings {
  emailNotifications: boolean;
  emailAddresses?: string[];
  webhookUrl?: string;
  slackWebhookUrl?: string;
}

/**
 * Agent settings
 */
export interface AgentSettings {
  autoUpdateAgent: boolean;
  reportingInterval: number; // minutes
  logLevel: AgentLogLevel;
}

/**
 * Agent log levels
 */
export type AgentLogLevel = 'Trace' | 'Debug' | 'Info' | 'Warn' | 'Error' | 'Fatal';

/**
 * Contact information
 */
export interface ContactInfo {
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  technicalContactName?: string;
  technicalContactEmail?: string;
  technicalContactPhone?: string;
  address?: Address;
}

/**
 * Address information
 */
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Billing information
 */
export interface BillingInfo {
  billingContactName?: string;
  billingContactEmail?: string;
  billingAddress?: Address;
  accountNumber?: string;
  notes?: string;
}

/**
 * Tenant search/filter parameters
 */
export interface TenantListParams extends SieveParams {
  /** Filter by status */
  status?: Status;
  /** Search by name */
  search?: string;
}

/**
 * Tenant creation data
 */
export interface TenantCreateData {
  name: string;
  displayName?: string;
  description?: string;
  timeZone?: string;
  contactInfo?: ContactInfo;
}

/**
 * Tenant update data
 */
export interface TenantUpdateData {
  displayName?: string;
  description?: string;
  status?: Status;
  timeZone?: string;
  settings?: Partial<TenantSettings>;
  contactInfo?: ContactInfo;
  billingInfo?: BillingInfo;
}