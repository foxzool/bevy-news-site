import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const author = z.enum(['bevy-news-bot', 'bevy-gzh-bot', 'gamedev-digest-bot']);

const shared = {
  title: z.string().min(1),
  date: z.coerce.date(),
  lang: z.enum(['zh', 'en']),
  tags: z.array(z.string().min(1)).default([]),
  summary: z.string().min(1),
  source_url: z.string().url(),
  translationKey: z.string().min(1),
  author,
  draft: z.boolean().default(false),
};

function generateId({ entry }: { entry: string }): string {
  return entry.replace(/\\/g, '/').replace(/\.md$/i, '');
}

function defineNewsCollection(dir: string, type: 'daily' | 'xscan' | 'article' | 'gamedev') {
  const shape =
    type === 'daily'
      ? { ...shared, type: z.literal('daily'), quiet_day: z.boolean().optional() }
      : { ...shared, type: z.literal(type) };

  return defineCollection({
    loader: glob({
      base: `./src/content/${dir}`,
      pattern: '**/*.md',
      generateId,
    }),
    schema: z.object(shape).strict(),
  });
}

export const collections = {
  daily: defineNewsCollection('daily', 'daily'),
  xscan: defineNewsCollection('xscan', 'xscan'),
  articles: defineNewsCollection('articles', 'article'),
  gamedev: defineNewsCollection('gamedev', 'gamedev'),
};
