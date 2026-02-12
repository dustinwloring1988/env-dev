export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface App {
  id: string;
  name: string;
  description: string | null;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    secrets: number;
  };
  secrets?: Secret[];
}

export interface Secret {
  id: string;
  key: string;
  value?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AppsResponse {
  apps: App[];
}

export interface AppResponse {
  app: App;
}

export interface SecretsResponse {
  secrets: Secret[];
}

export interface SecretResponse {
  secret: Secret;
}

export interface ErrorResponse {
  error: {
    message: string;
  };
}
