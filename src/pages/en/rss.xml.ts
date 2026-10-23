import type { APIRoute } from 'astro';
import { feedTitle, renderFeed } from '../../lib/feed';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.en,
    description: 'Reserved English feed. No English pages are published yet.',
    collections: ['daily', 'xscan', 'articles', 'gamedev'],
    lang: 'en',
  });
