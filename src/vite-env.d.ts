/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_NACHRICHTEN?: string
  readonly VITE_NACHRICHT_VON?: string
  readonly VITE_VORNAME?: string
  readonly VITE_KOSENAME?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_KURZNAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
