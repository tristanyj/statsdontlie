// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_TITLE = "Broadway | Who's the GOAT ?";
const SITE_DESCRIPTION = 'Visualize the best QBs in NFL history';
const SITE_URL = 'https://tristanyj.com';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // runtimeConfig: {
  //   public: {
  //     apiBase:
  //       process.env.NODE_ENV === "production"
  //         ? "/api"
  //         : "http://localhost:8080/api/v1",
  //   },
  // },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: SITE_TITLE,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'twitter:title',
          content: SITE_TITLE,
        },
        { name: 'twitter:url', content: SITE_URL },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@TODO:' },
        { name: 'twitter:image', content: '/backdrop.png' },
        { name: 'og:url', content: SITE_URL },
        { name: 'og:title', content: SITE_TITLE },
        {
          name: 'og:description',
          content: SITE_DESCRIPTION,
        },
        { name: 'og:image', content: '/backdrop.png' },
      ],
      style: [],
      script: [],
    },
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
  ],
});
