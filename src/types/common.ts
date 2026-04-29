/**
 * Common types used across ImmyBot resources
 */

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Sieve pagination parameters
 */
export interface SieveParams extends Record<string, unknown> {
  /** Filter expression (e.g., "name@=MyComputer") */
  filters?: string;
  /** Sort expression (e.g., "name,-createdAt") */
  sorts?: string;
  /** Page number (1-based) */
  page?: number;
  /** Page size */
  pageSize?: number;
}

/**
 * Paginated response wrapper
 */
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Status enumeration
 */
export type Status = 'Active' | 'Inactive' | 'Pending' | 'Error' | 'Disabled';

/**
 * Operating system types
 */
export type OperatingSystemType = 'Windows' | 'macOS' | 'Linux' | 'Unknown';