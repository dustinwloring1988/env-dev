import { create } from 'zustand';
import type { User, App } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

interface AppState {
  apps: App[];
  currentApp: App | null;
  setApps: (apps: App[]) => void;
  setCurrentApp: (app: App | null) => void;
  addApp: (app: App) => void;
  updateApp: (app: App) => void;
  removeApp: (id: string) => void;
  clearApps: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  apps: [],
  currentApp: null,
  setApps: (apps) => set({ apps }),
  setCurrentApp: (app) => set({ currentApp: app }),
  addApp: (app) => set((state) => ({ apps: [app, ...state.apps] })),
  updateApp: (app) =>
    set((state) => ({
      apps: state.apps.map((a) => (a.id === app.id ? app : a)),
      currentApp: state.currentApp?.id === app.id ? app : state.currentApp,
    })),
  removeApp: (id) =>
    set((state) => ({
      apps: state.apps.filter((a) => a.id !== id),
      currentApp: state.currentApp?.id === id ? null : state.currentApp,
    })),
  clearApps: () => set({ apps: [], currentApp: null }),
}));
