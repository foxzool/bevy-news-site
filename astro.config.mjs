import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://news.zool.me';

export default defineConfig({
  site,
  output: 'static',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
      // The static root page is the redirect. Astro's i18n redirect is
      // middleware-only except for a generated 2s meta refresh that replaces
      // src/pages/index.astro, so the page itself owns the redirect.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en',
        },
      },
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/' || pathname === '') return false;
        if (pathname.endsWith('rss.xml')) return false;
        if (pathname.endsWith('robots.txt')) return false;
        return true;
      },
    }),
  ],
});
