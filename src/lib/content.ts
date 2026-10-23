import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { absoluteUrl } from './site';

export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export type NewsCollection = 'daily' | 'xscan' | 'articles' | 'gamedev';

export type AnyEntry =
  | CollectionEntry<'daily'>
  | CollectionEntry<'xscan'>
  | CollectionEntry<'articles'>
  | CollectionEntry<'gamedev'>;

const SECTION: Record<NewsCollection, string> = {
  daily: 'daily',
  xscan: 'x',
  articles: 'articles',
  gamedev: 'gamedev',
};

export interface Listing {
  id: string;
  collection: NewsCollection;
  slug: string;
  href: string;
  title: string;
  date: Date;
  summary: string;
  tags: string[];
  lang: Locale;
  type: AnyEntry['data']['type'];
  quietDay: boolean;
  translationKey: string;
  author: AnyEntry['data']['author'];
  sourceUrl: string;
}

export function isQuietDay(entry: AnyEntry): boolean {
  return (
    entry.data.type === 'daily' &&
    (entry.data as { quiet_day?: boolean }).quiet_day === true
  );
}

export function slugFromId(id: string): string {
  const slash = id.indexOf('/');
  return slash === -1 ? id : id.slice(slash + 1);
}

export function hrefFor(collection: NewsCollection, id: string): string {
  const locale = id.split('/')[0];
  return `/${locale}/${SECTION[collection]}/${slugFromId(id)}/`;
}

function assertLocaleFolder(entry: AnyEntry): void {
  const folder = entry.id.split('/')[0];
  if (folder !== 'zh' && folder !== 'en') {
    throw new Error(
      `${entry.collection}/${entry.id}: entry id must start with zh/ or en/ (file belongs under that locale directory).`,
    );
  }
  if (folder !== entry.data.lang) {
    throw new Error(
      `${entry.collection}/${entry.id}: frontmatter lang "${entry.data.lang}" does not match directory "${folder}/".`,
    );
  }
}

function toListing(entry: AnyEntry): Listing {
  return {
    id: entry.id,
    collection: entry.collection,
    slug: slugFromId(entry.id),
    href: hrefFor(entry.collection, entry.id),
    title: entry.data.title,
    date: entry.data.date,
    summary: entry.data.summary,
    tags: entry.data.tags,
    lang: entry.data.lang,
    type: entry.data.type,
    quietDay: isQuietDay(entry),
    translationKey: entry.data.translationKey,
    author: entry.data.author,
    sourceUrl: entry.data.source_url,
  };
}

async function loadCollection(collection: NewsCollection): Promise<AnyEntry[]> {
  const entries = await getCollection(collection);
  for (const entry of entries) assertLocaleFolder(entry);
  return entries;
}

export async function getPublished(collection: NewsCollection, lang: Locale): Promise<Listing[]> {
  const entries = await loadCollection(collection);
  return entries
    .filter((entry) => entry.data.lang === lang && entry.data.draft !== true)
    .map(toListing)
    .sort(
      (a, b) => b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title, 'zh'),
    );
}

export async function getPublishedEntry(
  collection: NewsCollection,
  id: string,
): Promise<AnyEntry | undefined> {
  const entry = await getEntry(collection, id);
  if (!entry || entry.data.draft) return undefined;
  assertLocaleFolder(entry);
  return entry;
}

export async function pathsFor(collection: NewsCollection, lang: Locale) {
  const entries = await getPublished(collection, lang);
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { id: entry.id },
  }));
}

export async function allPublished(lang: Locale): Promise<Listing[]> {
  const groups = await Promise.all(
    (Object.keys(SECTION) as NewsCollection[]).map((collection) => getPublished(collection, lang)),
  );
  return groups
    .flat()
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title, 'zh'));
}

export async function hreflangLinks(
  translationKey: string,
): Promise<{ hreflang: string; href: string }[]> {
  const groups = await Promise.all(
    (Object.keys(SECTION) as NewsCollection[]).map((collection) => loadCollection(collection)),
  );
  const matches = groups
    .flat()
    .filter((entry) => entry.data.translationKey === translationKey && entry.data.draft !== true)
    .map(toListing);

  const links = matches.map((item) => ({
    hreflang: item.lang === 'zh' ? 'zh-CN' : 'en',
    href: absoluteUrl(item.href),
  }));

  const zh = links.find((link) => link.hreflang === 'zh-CN');
  if (zh) links.push({ hreflang: 'x-default', href: zh.href });
  return links;
}

const MIGRATION_TAGS = new Set(['migration', 'm-migration-guide', '迁移']);

export function isMigrationEntry(tags: string[]): boolean {
  return tags.some((tag) => MIGRATION_TAGS.has(tag.toLowerCase()) || tag === 'M-Migration-Guide');
}
