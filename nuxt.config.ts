// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  plugins: [
    '~/plugins/toast.client.ts'
  ],

  // PWA конфигурациясы - Safari UI жасыру үшін
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'AI Cargo',
      short_name: 'AI Cargo',
      description: 'Товарларды бақылау қосымшасы',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: '/',
      icons: [
        {
          src: '/images/logo.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/images/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: false
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },

  // iOS Safari үшін қосымша meta tags
  app: {
    head: {
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'AI Cargo' },
        { name: 'theme-color', content: '#000000' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/images/logo.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    }
  }
});
