import { http, HttpResponse } from 'msw';
import * as fixtures from '../fixtures/index.js';

const BASE_URL = 'https://testinstance.immy.bot/api/v1';
const OAUTH_URL = 'https://login.microsoftonline.com/test-tenant-id/oauth2/v2.0/token';

export const handlers = [
  // OAuth token endpoint
  http.post(OAUTH_URL, () => {
    return HttpResponse.json(fixtures.auth.validToken);
  }),

  // Health check
  http.get(`${BASE_URL}/health/`, () => {
    return HttpResponse.json(fixtures.health.status);
  }),

  // Instance info
  http.get(`${BASE_URL}/instance-info/`, () => {
    return HttpResponse.json(fixtures.instance.info);
  }),

  // Computers
  http.get(`${BASE_URL}/computers/`, () => {
    return HttpResponse.json(fixtures.computers.list);
  }),

  http.get(`${BASE_URL}/computers/:id/`, ({ params }) => {
    const computer = fixtures.computers.list.find(c => c.id === Number(params.id));
    if (!computer) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(computer);
  }),

  http.post(`${BASE_URL}/computers/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...fixtures.computers.created,
      ...body,
      id: Math.floor(Math.random() * 10000),
    });
  }),

  http.get(`${BASE_URL}/computers/:id/inventory/`, () => {
    return HttpResponse.json([]);
  }),

  // Software
  http.get(`${BASE_URL}/software/global/`, () => {
    return HttpResponse.json(fixtures.software.global);
  }),

  http.get(`${BASE_URL}/software/`, () => {
    return HttpResponse.json(fixtures.software.list);
  }),

  http.get(`${BASE_URL}/software/:id/`, ({ params }) => {
    const software = fixtures.software.list.find(s => s.id === Number(params.id));
    if (!software) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(software);
  }),

  http.get(`${BASE_URL}/software/:id/versions/`, () => {
    return HttpResponse.json(fixtures.software.versions);
  }),

  // Deployments
  http.get(`${BASE_URL}/deployments/`, () => {
    return HttpResponse.json(fixtures.deployments.list);
  }),

  http.get(`${BASE_URL}/deployments/:id/`, ({ params }) => {
    const deployment = fixtures.deployments.list.find(d => d.id === Number(params.id));
    if (!deployment) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(deployment);
  }),

  http.post(`${BASE_URL}/deployments/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...fixtures.deployments.created,
      ...body,
      id: Math.floor(Math.random() * 10000),
    });
  }),

  // Scripts
  http.get(`${BASE_URL}/scripts/`, () => {
    return HttpResponse.json(fixtures.scripts.list);
  }),

  http.get(`${BASE_URL}/scripts/:id/`, ({ params }) => {
    const script = fixtures.scripts.list.find(s => s.id === Number(params.id));
    if (!script) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(script);
  }),

  http.post(`${BASE_URL}/scripts/:id/execute/`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...fixtures.scripts.executionResult,
      scriptId: Number(params.id),
      computerId: (body as any).computerId,
      id: Math.floor(Math.random() * 10000),
    });
  }),

  // Tenants
  http.get(`${BASE_URL}/tenants/`, () => {
    return HttpResponse.json(fixtures.tenants.list);
  }),

  http.get(`${BASE_URL}/tenants/:id/`, ({ params }) => {
    const tenant = fixtures.tenants.list.find(t => t.id === Number(params.id));
    if (!tenant) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(tenant);
  }),

  // Maintenance Sessions
  http.get(`${BASE_URL}/maintenance-sessions/`, () => {
    return HttpResponse.json(fixtures.maintenanceSessions.list);
  }),

  http.get(`${BASE_URL}/maintenance-sessions/:id/`, ({ params }) => {
    const session = fixtures.maintenanceSessions.list.find(s => s.id === Number(params.id));
    if (!session) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(session);
  }),

  http.post(`${BASE_URL}/run-immy-service/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      ...fixtures.maintenanceSessions.started,
      computerId: (body as any).computerId,
      id: Math.floor(Math.random() * 10000),
    });
  }),

  // Tasks
  http.get(`${BASE_URL}/tasks/`, () => {
    return HttpResponse.json(fixtures.tasks.list);
  }),

  http.get(`${BASE_URL}/tasks/:id/`, ({ params }) => {
    const task = fixtures.tasks.list.find(t => t.id === Number(params.id));
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.get(`${BASE_URL}/tasks/queue-stats/`, () => {
    return HttpResponse.json(fixtures.tasks.queueStats);
  }),

  // Error responses for testing
  http.get(`${BASE_URL}/error/401/`, () => {
    return new HttpResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }),

  http.get(`${BASE_URL}/error/429/`, () => {
    return new HttpResponse(JSON.stringify({ error: 'Rate limited' }), {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }),

  http.get(`${BASE_URL}/error/500/`, () => {
    return new HttpResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }),
];