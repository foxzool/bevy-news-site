import type { APIRoute } from 'astro';
import { feedTitle, renderFeed } from '../../../lib/feed';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.gamedev,
    description: '游戏开发资讯周报。',
    collections: ['gamedev'],
  });
