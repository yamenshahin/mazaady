// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["bootstrap/dist/css/bootstrap.min.css", '~/assets/css/main.css'],
  app: {
    head: {
      title: 'Mazaady Portal',
    }
  },
  runtimeConfig:{
    public: {
      apiBase: process.env.MAZAADY_API_BASE_URL,
      mazaadyPrivateKey: process.env.MAZAADY_API_PRIVATE_KEY,
    }
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-lodash',
    ['@nuxtjs/google-fonts', {
      families: {
        Nunito: [400, 700, 800],
      }
    }]
  ],
})
