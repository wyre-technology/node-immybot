# @wyre-technology/node-immybot

Node.js/TypeScript client library for the ImmyBot API with OAuth 2.0 authentication via Microsoft Entra ID.

## Features

- 🔐 **OAuth 2.0 Authentication** - Microsoft Entra ID client credentials flow
- 🏢 **Multi-tenant Support** - Per-instance subdomain configuration
- 📊 **Full API Coverage** - Computers, software, deployments, scripts, tenants, maintenance sessions, tasks
- ⚡ **Zero Runtime Dependencies** - Uses native `fetch` API
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🔄 **Rate Limiting** - Token bucket rate limiter with configurable limits
- 🗂️ **Error Handling** - Structured error hierarchy with specific error types
- ✅ **Dual Module Support** - ESM and CommonJS compatible

## Installation

```bash
npm install @wyre-technology/node-immybot
```

## Quick Start

```typescript
import { ImmyBotClient } from '@wyre-technology/node-immybot';

const client = new ImmyBotClient({
  instanceSubdomain: 'acmemsp', // Your ImmyBot instance subdomain
  tenantId: 'your-entra-tenant-id',
  clientId: 'your-app-registration-client-id', 
  clientSecret: 'your-client-secret',
});

// List computers
const computers = await client.computers.list();
console.log(`Found ${computers.length} computers`);

// Deploy software to a computer  
const deployment = await client.deployments.targetComputer({
  softwareId: 123,
  computerId: 456,
  desiredState: 'Installed',
});

// Start maintenance session to reconcile desired state
const session = await client.maintenanceSessions.start({
  computerId: 456,
});
```

## Authentication Setup

ImmyBot uses OAuth 2.0 with Microsoft Entra ID (Azure AD). You need to:

1. **Register an Enterprise Application** in your Entra tenant
2. **Grant ImmyBot API permissions** to the application  
3. **Create a client secret** for the application
4. **Configure the application** in ImmyBot settings

The OAuth scope format is `api://{client_id}/.default` where `{client_id}` is your application registration's client ID.

### Required Configuration

- `instanceSubdomain`: Your ImmyBot instance subdomain (e.g., 'acmemsp' for acmemsp.immy.bot)
- `tenantId`: Microsoft Entra tenant ID
- `clientId`: Application (client) ID from your App Registration
- `clientSecret`: Client secret value from your App Registration

## API Resources

### Computers

Manage devices/endpoints in ImmyBot:

```typescript
// List all computers
const computers = await client.computers.list();

// Get specific computer
const computer = await client.computers.get(123);

// Search computers
const results = await client.computers.search('DESKTOP');

// Get computer inventory
const inventory = await client.computers.getInventory(123);

// Create computer record
const newComputer = await client.computers.create({
  name: 'NEW-COMPUTER',
  tenantId: 1,
  serialNumber: 'ABC123',
});
```

### Software

Manage applications and software packages:

```typescript
// List global software
const globalSoftware = await client.software.listGlobal();

// Search software by name
const chromeVersions = await client.software.search('Chrome');

// Get software versions
const versions = await client.software.listVersions(123);

// Get latest version
const latest = await client.software.getLatestVersion(123);
```

### Deployments

Configure desired software state:

```typescript
// List deployments
const deployments = await client.deployments.list();

// Deploy software to computer
const deployment = await client.deployments.targetComputer({
  softwareId: 123,
  computerId: 456,
  desiredState: 'Installed',
  autoUpdate: true,
});

// Deploy to entire tenant
const tenantDeployment = await client.deployments.targetTenant({
  softwareId: 123,
  tenantId: 1,
  desiredState: 'Installed',
});

// Trigger deployment (stages for next maintenance session)
await client.deployments.trigger(deploymentId);
```

### Scripts

Execute PowerShell scripts on endpoints:

```typescript
// List available scripts
const scripts = await client.scripts.list();

// Execute script on computer (DESTRUCTIVE OPERATION)
const result = await client.scripts.executeOnComputer(scriptId, {
  computerId: 123,
  parameters: { param1: 'value1' },
  runAsSystem: true,
});

// Get execution results
const executions = await client.scripts.getExecutionResults(scriptId);
```

### Maintenance Sessions

Reconcile desired state through maintenance sessions:

```typescript
// List maintenance sessions
const sessions = await client.maintenanceSessions.list();

// Start maintenance session (reconciles deployments)
const session = await client.maintenanceSessions.start({
  computerId: 123,
  sessionType: 'Manual',
});

// Monitor session status
const running = await client.maintenanceSessions.get(session.id);
console.log(`Progress: ${running.progress}%`);

// Cancel session
await client.maintenanceSessions.cancel(session.id, 'User requested');
```

### Tenants

Manage client organizations:

```typescript
// List tenants
const tenants = await client.tenants.list();

// Get tenant details
const tenant = await client.tenants.get(1);

// Get tenant statistics  
const stats = await client.tenants.getStats(1);

// Get compliance dashboard
const compliance = await client.tenants.getComplianceDashboard(1);
```

### Tasks

Monitor background operations:

```typescript
// List all tasks
const tasks = await client.tasks.list();

// Get running tasks
const running = await client.tasks.getRunning();

// Get task queue statistics
const stats = await client.tasks.getQueueStats();

// Cancel a task
await client.tasks.cancel(taskId, 'No longer needed');
```

## Error Handling

The client provides structured error handling:

```typescript
import { 
  AuthenticationError, 
  NotFoundError, 
  RateLimitError,
  ValidationError 
} from '@wyre-technology/node-immybot';

try {
  const computer = await client.computers.get(123);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Invalid credentials or token expired');
  } else if (error instanceof NotFoundError) {
    console.log('Computer not found');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.errors);
  }
}
```

## Configuration Options

```typescript
const client = new ImmyBotClient({
  instanceSubdomain: 'acmemsp',
  tenantId: 'tenant-id', 
  clientId: 'client-id',
  clientSecret: 'client-secret',
  
  // Optional settings
  timeout: 30000, // Request timeout in ms (default: 30000)
  userAgent: 'MyApp/1.0', // Custom user agent
  rateLimiter: {
    maxRequests: 100, // Max requests per window
    windowMs: 60000,  // Window duration in ms
  },
});
```

## Two-Step Deployment Model

⚠️ **Important**: ImmyBot uses a two-step deployment workflow:

1. **Configure desired state** - Create deployments that define what software should be installed
2. **Reconcile via maintenance session** - Run maintenance sessions to apply the desired state

Simply creating a deployment does not immediately install software. A maintenance session must run to reconcile the desired state with the actual state on the device.

```typescript
// Step 1: Configure desired state
const deployment = await client.deployments.targetComputer({
  softwareId: 123,
  computerId: 456, 
  desiredState: 'Installed',
});

// Step 2: Reconcile via maintenance session
const session = await client.maintenanceSessions.start({
  computerId: 456,
});

// Monitor progress
const status = await client.maintenanceSessions.get(session.id);
console.log(`Maintenance session ${status.progress}% complete`);
```

## Rate Limiting

The client includes a token bucket rate limiter to prevent hitting ImmyBot's undocumented rate limits:

- Conservative defaults: 100 requests per minute
- Automatic retry with exponential backoff on HTTP 429
- Honors `Retry-After` header when provided
- Configurable limits per client instance

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

Apache-2.0 - see [LICENSE](LICENSE) for details.

## Support

- [ImmyBot API Documentation](https://docs.immy.bot/reference/api-documentation/)
- [Microsoft Entra App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [OAuth 2.0 Client Credentials Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow)