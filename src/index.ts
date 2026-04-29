/**
 * @fileoverview ImmyBot API Client Library
 *
 * A TypeScript client library for the ImmyBot API with OAuth 2.0 authentication
 * via Microsoft Entra ID. Supports all major ImmyBot resources including computers,
 * software, deployments, scripts, tenants, maintenance sessions, and tasks.
 *
 * @example
 * ```typescript
 * import { ImmyBotClient } from '@wyre-technology/node-immybot';
 *
 * const client = new ImmyBotClient({
 *   instanceSubdomain: 'acmemsp',
 *   tenantId: 'your-entra-tenant-id',
 *   clientId: 'your-app-registration-client-id',
 *   clientSecret: 'your-client-secret',
 * });
 *
 * // List computers
 * const computers = await client.computers.list();
 *
 * // Deploy software to a computer
 * const deployment = await client.deployments.targetComputer({
 *   softwareId: 123,
 *   computerId: 456,
 *   desiredState: 'Installed',
 * });
 *
 * // Start maintenance session to reconcile state
 * const session = await client.maintenanceSessions.start({
 *   computerId: 456,
 * });
 * ```
 */

// Main client
export { ImmyBotClient } from './client.js';

// Configuration and auth
export type { ImmyBotConfig } from './config.js';
export { DEFAULT_CONFIG } from './config.js';

// Error classes
export {
  ServiceError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from './errors.js';

// HTTP utilities
export { HttpClient } from './http.js';

// All type definitions
export * from './types/index.js';

// Resource classes (for advanced usage)
export { ComputersResource } from './resources/computers.js';
export { SoftwareResource } from './resources/software.js';
export { DeploymentsResource } from './resources/deployments.js';
export { ScriptsResource } from './resources/scripts.js';
export { TenantsResource } from './resources/tenants.js';
export { MaintenanceSessionsResource } from './resources/maintenance-sessions.js';
export { TasksResource } from './resources/tasks.js';

// Note: Default export removed to avoid TypeScript compilation issues