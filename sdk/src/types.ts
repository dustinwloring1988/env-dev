export interface App {
  id: string;
  name: string;
  description: string | null;
  apiKey: string;
  requireAuth: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Secret {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  appId: string;
}

export interface DecryptedSecret {
  key: string;
  value: string;
}

export interface ClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface CreateSecretInput {
  key: string;
  value: string;
}

export interface UpdateSecretInput {
  value: string;
}

export interface ApiResponse<T> {
  data: T;
}
