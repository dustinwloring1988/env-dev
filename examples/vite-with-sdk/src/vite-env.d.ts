/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVDEV_URL: string
  readonly VITE_APP_ID: string
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
