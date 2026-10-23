import type { APIRoute } from 'astro';
import { renderFeed, feedTitle } from '../../lib/feed';
import { SITE_DESCRIPTION } from '../../lib/site';

export const GET: APIRoute = (context) =>
  renderFeed(context, {
    title: feedTitle.site,
    description: SITE_DESCRIPTION,
    collections: ['daily', 'xscan', 'articles', 'gamedev'],
  });
