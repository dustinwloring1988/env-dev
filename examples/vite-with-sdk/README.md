# Vite with env-dev SDK Example

This example demonstrates how to use the `env-dev-sdk` package in a Vite + React + TypeScript application to interact with a local env-dev instance running in Docker.

## Prerequisites

1. **env-dev running in Docker** on port 3001:
   ```bash
   # From the root of env-dev repo
   docker compose -f docker-compose.dev.yml up -d
   ```

2. **Node.js** 16 or higher

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - `VITE_ENVDEV_URL`: The URL of your env-dev instance (default: http://localhost:3001)
   - `VITE_APP_ID`: The ID of the app you want to manage
   - `VITE_API_KEY`: Your app's API key from env-dev

3. **Get your credentials from env-dev**:
   - Open http://localhost in your browser
   - Log in and create an app
   - Go to the app settings to find the App ID and API Key

## Running the App

```bash
npm run dev
```

The app will start on http://localhost:5174

## Features

This example demonstrates:

- **Listing secrets** for an app
- **Creating new secrets** with key-value pairs
- **Updating existing secrets**
- **Deleting secrets**
- **Viewing decrypted secret values** (with a toggle)

## SDK Usage Examples

### Initialize the client
```typescript
import { EnvDevClient } from 'env-dev-sdk';

const client = new EnvDevClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3001'
});
```

### Get all secrets
```typescript
const secrets = await client.getSecrets('app-id');
```

### Get decrypted secrets
```typescript
const decrypted = await client.getDecryptedSecrets('app-id');
```

### Create a secret
```typescript
await client.createSecret('app-id', 'API_KEY', 'secret-value');
```

### Update a secret
```typescript
await client.updateSecret('app-id', 'API_KEY', 'new-value');
```

### Delete a secret
```typescript
await client.deleteSecret('app-id', 'API_KEY');
```

## Project Structure

```
vite-with-sdk/
├── src/
│   ├── client.ts           # SDK client configuration
│   ├── hooks/
│   │   └── useEnvDev.ts    # React hook for SDK operations
│   ├── components/
│   │   └── SecretManager.tsx  # UI component for managing secrets
│   ├── App.tsx             # Main app component
│   ├── App.css             # Styles
│   └── main.tsx            # Entry point
├── .env.example            # Environment variables template
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Learn More

- [env-dev-sdk documentation](https://www.npmjs.com/package/env-dev-sdk)
- [env-dev repository](../..)
