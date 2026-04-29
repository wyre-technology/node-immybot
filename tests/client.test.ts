import { describe, it, expect, beforeEach } from 'vitest';
import { ImmyBotClient } from '../src/client.js';
import type { ImmyBotConfig } from '../src/config.js';

describe('ImmyBotClient', () => {
  let client: ImmyBotClient;
  let config: ImmyBotConfig;

  beforeEach(() => {
    config = {
      instanceSubdomain: 'testinstance',
      tenantId: 'test-tenant-id',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      timeout: 10000,
    };
    client = new ImmyBotClient(config);
  });

  describe('testConnection', () => {
    it('should return connection status', async () => {
      const result = await client.testConnection();

      expect(result).toEqual({
        connected: true,
        instanceSubdomain: 'testinstance',
        authenticated: true,
        userInfo: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
        version: '1.2.3',
      });
    });
  });

  describe('getInstanceInfo', () => {
    it('should return instance information', async () => {
      const result = await client.getInstanceInfo();

      expect(result).toEqual({
        version: '1.2.3',
        instance: 'testinstance',
        timezone: 'America/Chicago',
        features: ['deployments', 'scripts', 'maintenance-sessions'],
      });
    });
  });

  describe('resource access', () => {
    it('should provide access to computers resource', () => {
      expect(client.computers).toBeDefined();
      expect(typeof client.computers.list).toBe('function');
    });

    it('should provide access to software resource', () => {
      expect(client.software).toBeDefined();
      expect(typeof client.software.list).toBe('function');
    });

    it('should provide access to deployments resource', () => {
      expect(client.deployments).toBeDefined();
      expect(typeof client.deployments.list).toBe('function');
    });

    it('should provide access to scripts resource', () => {
      expect(client.scripts).toBeDefined();
      expect(typeof client.scripts.list).toBe('function');
    });

    it('should provide access to tenants resource', () => {
      expect(client.tenants).toBeDefined();
      expect(typeof client.tenants.list).toBe('function');
    });

    it('should provide access to maintenance sessions resource', () => {
      expect(client.maintenanceSessions).toBeDefined();
      expect(typeof client.maintenanceSessions.list).toBe('function');
    });

    it('should provide access to tasks resource', () => {
      expect(client.tasks).toBeDefined();
      expect(typeof client.tasks.list).toBe('function');
    });
  });

  describe('authentication', () => {
    it('should start with no cached token', () => {
      expect(client.isAuthenticated()).toBe(false);
    });

    it('should clear auth cache', () => {
      client.clearAuthCache();
      expect(client.isAuthenticated()).toBe(false);
    });
  });
});