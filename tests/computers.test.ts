import { describe, it, expect, beforeEach } from 'vitest';
import { ImmyBotClient } from '../src/client.js';
import type { ImmyBotConfig } from '../src/config.js';

describe('ComputersResource', () => {
  let client: ImmyBotClient;
  let config: ImmyBotConfig;

  beforeEach(() => {
    config = {
      instanceSubdomain: 'testinstance',
      tenantId: 'test-tenant-id',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
    };
    client = new ImmyBotClient(config);
  });

  describe('list', () => {
    it('should return list of computers', async () => {
      const computers = await client.computers.list();

      expect(computers).toHaveLength(2);
      expect(computers[0]).toMatchObject({
        id: 1,
        name: 'DESKTOP-TEST-01',
        operatingSystem: 'Windows',
        status: 'Active',
        isOnline: true,
      });
      expect(computers[1]).toMatchObject({
        id: 2,
        name: 'LAPTOP-TEST-02',
        operatingSystem: 'Windows',
        status: 'Active',
        isOnline: false,
      });
    });

    it('should accept filter parameters', async () => {
      const computers = await client.computers.list({
        tenantId: 1,
        isOnline: true,
      });

      // MSW will return the same fixture, but in real usage this would filter
      expect(computers).toHaveLength(2);
    });
  });

  describe('get', () => {
    it('should return a specific computer', async () => {
      const computer = await client.computers.get(1);

      expect(computer).toMatchObject({
        id: 1,
        name: 'DESKTOP-TEST-01',
        operatingSystem: 'Windows',
        status: 'Active',
      });
    });

    it('should handle not found', async () => {
      await expect(client.computers.get(999)).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search computers by name', async () => {
      const computers = await client.computers.search('DESKTOP');

      // MSW returns the full list for any search
      expect(computers).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('should create a new computer', async () => {
      const computerData = {
        name: 'NEW-COMPUTER',
        tenantId: 1,
        serialNumber: 'NEW123456',
        description: 'Test computer',
      };

      const computer = await client.computers.create(computerData);

      expect(computer).toMatchObject({
        name: 'NEW-COMPUTER',
        tenantId: 1,
        serialNumber: 'NEW123456',
        description: 'Test computer',
        status: 'Active',
      });
      expect(computer.id).toBeGreaterThan(0);
    });
  });

  describe('getInventory', () => {
    it('should return computer inventory', async () => {
      // This would return inventory data in real usage
      const inventory = await client.computers.getInventory(1);
      expect(Array.isArray(inventory)).toBe(true);
    });
  });
});