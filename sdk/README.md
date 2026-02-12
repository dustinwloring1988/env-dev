# env-dev-sdk

TypeScript SDK for managing secrets with env-dev.

## Installation

```bash
npm install env-dev-sdk
```

## Quick Start

```typescript
import { EnvDevClient } from 'env-dev-sdk';

const client = new EnvDevClient({
  apiKey: 'your-api-key',
  // Optional: defaults to http://localhost:3001
  baseUrl: 'http://your-env-dev-instance:3001'
});

// Get all secrets for an app
const secrets = await client.getSecrets('app-id');

// Get decrypted secrets
const decrypted = await client.getDecryptedSecrets('app-id');

// Load secrets as key-value object
const envVars = await client.loadSecrets('app-id');
console.log(envVars.API_KEY); // Access secrets easily
```

## Configuration

```typescript
const client = new EnvDevClient({
  apiKey: 'required-api-key',
  baseUrl: 'http://localhost:3001',  // Optional, default: http://localhost:3001
  timeout: 30000,                     // Optional, default: 30000ms
  retries: 3                          // Optional, default: 3
});
```

## App Operations

```typescript
// List all apps
const apps = await client.getApps();

// Get specific app
const app = await client.getApp('app-id');

// Create app
const newApp = await client.createApp('my-app', 'Description');

// Update app
await client.updateApp('app-id', 'new-name', 'New description');

// Delete app
await client.deleteApp('app-id');

// Regenerate API key
const updated = await client.regenerateApiKey('app-id');

// Toggle auth requirement
await client.toggleRequireAuth('app-id', true);
```

## Secret Operations

```typescript
// Get all secrets (encrypted values)
const secrets = await client.getSecrets('app-id');

// Get single secret
const secret = await client.getSecret('app-id', 'API_KEY');

// Get all decrypted secrets
const decrypted = await client.getDecryptedSecrets('app-id');

// Create secret
await client.createSecret('app-id', 'NEW_KEY', 'secret-value');

// Update secret
await client.updateSecret('app-id', 'EXISTING_KEY', 'new-value');

// Delete secret
await client.deleteSecret('app-id', 'OLD_KEY');
```

## Error Handling

```typescript
import { AuthError, NotFoundError, ValidationError, NetworkError } from 'env-dev-sdk';

try {
  const secrets = await client.getSecrets('app-id');
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Invalid API key');
  } else if (error instanceof NotFoundError) {
    console.error('App not found');
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error, check your connection');
  }
}
```

## License

MIT
