import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// App-Name aus der Umgebung: das öffentliche Repo bleibt neutral, der eigene Build
// kann einen persönlichen Namen tragen (lokal .env.local, beim Hosting die Projekteinstellungen).
const env = loadEnv(process.env.NODE_ENV === 'production' ? 'production' : 'development', process.cwd(), 'VITE_')
const APP_NAME = env.VITE_APP_NAME?.trim() || 'AzubiBoost Einzelhandel'
const APP_KURZNAME = env.VITE_APP_KURZNAME?.trim() || 'AzubiBoost'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'app-name-in-html',
      transformIndexHtml: (html) => html.replaceAll('__APP_NAME__', APP_NAME).replaceAll('__APP_KURZNAME__', APP_KURZNAME),
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-180.png'],
      manifest: {
        name: APP_NAME,
        short_name: APP_KURZNAME,
        description:
          'Prüfungsvorbereitung für die Abschlussprüfung Kauffrau/Kaufmann im Einzelhandel',
        lang: 'de',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fbf6f3',
        theme_color: '#a82b58',
        categories: ['education'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Offline nur die lateinischen Schriftschnitte — Deutsch samt € braucht keine anderen.
        globPatterns: ['**/*.{js,css,html,svg,png}', '**/*-latin-wght-normal-*.woff2'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
