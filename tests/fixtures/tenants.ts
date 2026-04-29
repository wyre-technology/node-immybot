export const list = [
  {
    id: 1,
    name: 'ACME Corporation',
    displayName: 'ACME Corp',
    description: 'Main client organization',
    status: 'Active' as const,
    timeZone: 'America/Chicago',
    businessHours: {
      monday: { start: '08:00', end: '17:00', enabled: true },
      tuesday: { start: '08:00', end: '17:00', enabled: true },
      wednesday: { start: '08:00', end: '17:00', enabled: true },
      thursday: { start: '08:00', end: '17:00', enabled: true },
      friday: { start: '08:00', end: '17:00', enabled: true },
      saturday: { start: '09:00', end: '12:00', enabled: false },
      sunday: { start: '09:00', end: '12:00', enabled: false },
      holidays: [],
    },
    settings: {
      autoInstallUpdates: true,
      allowRebootsDuringBusinessHours: false,
      maintenanceSessionFrequency: 'Weekly' as const,
    },
    contactInfo: {
      primaryContactName: 'John Doe',
      primaryContactEmail: 'john.doe@acme.com',
      primaryContactPhone: '555-123-4567',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];