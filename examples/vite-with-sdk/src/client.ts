import { EnvDevClient } from 'env-dev-sdk';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_ENVDEV_URL;
const APP_ID = import.meta.env.VITE_APP_ID;

if (!API_KEY) {
  console.error('VITE_API_KEY is not set in .env file');
}

if (!APP_ID) {
  console.error('VITE_APP_ID is not set in .env file');
}

export const client = new EnvDevClient({
  apiKey: API_KEY || '',
  baseUrl: BASE_URL || 'http://localhost:3001',
});

export { APP_ID };
