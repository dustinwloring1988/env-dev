import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, App } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

const STORAGE_KEY = 'auth-storage';

const createAuthStore = () =>
  create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        setAuth: (user, accessToken, refreshToken) => {
          const state = { user, accessToken, refreshToken, isAuthenticated: true };
          set(state);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          } catch {}
        },
        clearAuth: () => {
          const state = { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
          set(state);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
        },
        updateUser: (user) => set({ user }),
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  );

export const useAuthStore = createAuthStore();

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
