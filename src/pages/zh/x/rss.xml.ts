import type { APIRoute } from 'astro';
import { feedTitle, renderFeed } from '../../../lib/feed';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.xscan,
    description: 'Bevy 社区动态。',
    collections: ['xscan'],
  });
