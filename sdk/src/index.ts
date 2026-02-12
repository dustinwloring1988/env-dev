import {
  ClientConfig,
  App,
  Secret,
  DecryptedSecret,
  CreateSecretInput,
  UpdateSecretInput,
  ApiResponse,
} from './types';
import {
  EnvDevError,
  AuthError,
  NotFoundError,
  ValidationError,
  ServerError,
  NetworkError,
} from './errors';

export class EnvDevClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor(config: ClientConfig) {
    if (!config.apiKey) {
      throw new ValidationError('API key is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'http://localhost:3001').replace(/\/$/, '');
    this.timeout = config.timeout || 30000;
    this.retries = config.retries ?? 3;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;

        switch (response.status) {
          case 401:
            throw new AuthError(errorMessage);
          case 404:
            throw new NotFoundError(errorData.resource || 'Resource');
          case 400:
          case 422:
            throw new ValidationError(errorMessage);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ServerError(errorMessage, response.status);
          default:
            throw new EnvDevError(errorMessage);
        }
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      const data = await response.json();
      return data.data !== undefined ? data.data : data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof EnvDevError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout');
        }

        // Retry on network errors if we haven't exceeded max retries
        if (attempt < this.retries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, attempt + 1);
        }

        throw new NetworkError(error.message);
      }

      throw new EnvDevError('Unknown error occurred');
    }
  }

  // ========== App Operations ==========

  async getApps(): Promise<App[]> {
    return this.request<App[]>('/apps', { method: 'GET' });
  }

  async getApp(id: string): Promise<App> {
    if (!id) throw new ValidationError('App ID is required');
    return this.request<App>(`/apps/${id}`, { method: 'GET' });
  }

  async createApp(name: string, description?: string): Promise<App> {
    if (!name) throw new ValidationError('App name is required');
    return this.request<App>('/apps', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async updateApp(id: string, name: string, description?: string): Promise<App> {
    if (!id) throw new ValidationError('App ID is required');
    if (!name) throw new ValidationError('App name is required');
    return this.request<App>(`/apps/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteApp(id: string): Promise<void> {
    if (!id) throw new ValidationError('App ID is required');
    await this.request<void>(`/apps/${id}`, { method: 'DELETE' });
  }

  async regenerateApiKey(id: string): Promise<App> {
    if (!id) throw new ValidationError('App ID is required');
    return this.request<App>(`/apps/${id}/regenerate-key`, { method: 'POST' });
  }

  async toggleRequireAuth(id: string, requireAuth: boolean): Promise<App> {
    if (!id) throw new ValidationError('App ID is required');
    return this.request<App>(`/apps/${id}/require-auth`, {
      method: 'PUT',
      body: JSON.stringify({ requireAuth }),
    });
  }

  // ========== Secret Operations ==========

  async getSecrets(appId: string): Promise<Secret[]> {
    if (!appId) throw new ValidationError('App ID is required');
    return this.request<Secret[]>(`/apps/${appId}/secrets`, { method: 'GET' });
  }

  async getSecret(appId: string, key: string): Promise<Secret> {
    if (!appId) throw new ValidationError('App ID is required');
    if (!key) throw new ValidationError('Secret key is required');
    return this.request<Secret>(`/apps/${appId}/secrets/${encodeURIComponent(key)}`, { method: 'GET' });
  }

  async getDecryptedSecrets(appId: string): Promise<DecryptedSecret[]> {
    if (!appId) throw new ValidationError('App ID is required');
    return this.request<DecryptedSecret[]>(`/apps/${appId}/secrets/export`, { method: 'GET' });
  }

  async createSecret(appId: string, key: string, value: string): Promise<Secret> {
    if (!appId) throw new ValidationError('App ID is required');
    if (!key) throw new ValidationError('Secret key is required');
    if (value === undefined) throw new ValidationError('Secret value is required');
    return this.request<Secret>(`/apps/${appId}/secrets`, {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  async updateSecret(appId: string, key: string, value: string): Promise<Secret> {
    if (!appId) throw new ValidationError('App ID is required');
    if (!key) throw new ValidationError('Secret key is required');
    if (value === undefined) throw new ValidationError('Secret value is required');
    return this.request<Secret>(`/apps/${appId}/secrets/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async deleteSecret(appId: string, key: string): Promise<void> {
    if (!appId) throw new ValidationError('App ID is required');
    if (!key) throw new ValidationError('Secret key is required');
    await this.request<void>(`/apps/${appId}/secrets/${encodeURIComponent(key)}`, { method: 'DELETE' });
  }

  // ========== Utility Methods ==========

  /**
   * Load all decrypted secrets for an app and return as a key-value object
   */
  async loadSecrets(appId: string): Promise<Record<string, string>> {
    const secrets = await this.getDecryptedSecrets(appId);
    return secrets.reduce((acc, secret) => {
      acc[secret.key] = secret.value;
      return acc;
    }, {} as Record<string, string>);
  }
}

// Export types and errors
export * from './types';
export * from './errors';
