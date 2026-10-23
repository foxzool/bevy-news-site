import type { APIRoute } from 'astro';
import { feedTitle, renderFeed } from '../../../lib/feed';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.daily,
    description: 'Bevy Wiki 日报。',
    collections: ['daily'],
  });
