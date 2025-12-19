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
      name: 'AI Market',
      short_name: 'AI Market',
      description: 'Товарларды бақылау қосымшасы',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone', // ⬅️ Бұл Safari UI-ын жасырады!
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/images/logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/images/logo.png',
          sizes: '512x512',
          type: 'image/png'
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
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'AI Market' },
        { name: 'theme-color', content: '#000000' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' }
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/images/logo.png' }
      ]
    }
  }
});
