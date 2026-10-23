import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished, type Locale, type NewsCollection } from './content';
import { SITE_NAME, SITE_URL } from './site';

export async function renderFeed(
  context: APIContext,
  options: {
    title: string;
    description: string;
    collections: NewsCollection[];
    lang?: Locale;
  },
) {
  const lang = options.lang ?? 'zh';
  if (!context.site) {
    throw new Error('astro.config site is required to build RSS.');
  }

  const groups = await Promise.all(
    options.collections.map((collection) => getPublished(collection, lang)),
  );
  const items = groups
    .flat()
    .filter((item) => !item.quietDay)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const channelLink =
    lang === 'zh' ? new URL('/zh/', SITE_URL).href : new URL('/en/rss.xml', SITE_URL).href;

  return rss({
    title: options.title,
    description: options.description,
    site: context.site,
    customData: `<language>${lang === 'zh' ? 'zh-cn' : 'en'}</language><link>${channelLink}</link>`,
    items: items.map((item) => ({
      title: item.title,
      pubDate: item.date,
      description: item.summary,
      link: item.href,
      categories: item.tags,
    })),
  });
}

export const feedTitle = {
  site: SITE_NAME,
  daily: `${SITE_NAME} · 日报`,
  xscan: `${SITE_NAME} · 社区动态`,
  articles: `${SITE_NAME} · 长文`,
  gamedev: `${SITE_NAME} · 游戏开发`,
  en: `${SITE_NAME} · English`,
};
