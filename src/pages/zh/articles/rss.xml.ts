import type { APIRoute } from 'astro';
import { feedTitle, renderFeed } from '../../../lib/feed';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.articles,
    description: '开发者简报长文。',
    collections: ['articles'],
  });
