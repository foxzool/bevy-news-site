# 狐闻

公开新闻站，域名 [news.zool.me](https://news.zool.me)。中文优先：默认语言是 `zh`，并且 `prefixDefaultLocale: true`，所以页面都在 `/zh/` 下。站点根路径 `/` 用 meta refresh 跳到 `/zh/`。英文 `/en/` 只预留了内容目录和 `/en/rss.xml`，还没有页面。

技术栈是 Astro **5.18.2**（当前 5.x 最新稳定版）。npm 上的 `astro@latest` 已经是 7.x，本仓库固定在 5.x。

## 安装与构建

需要 Node.js 18.20.8、20.3 及以上，或 22 及以上。

```bash
npm ci
npm run build
npm run preview
```

`npm run build` 会先跑 `astro build`，再跑 `pagefind --site dist`，把搜索索引写到 `dist/pagefind/`。页面语言写在 `<html lang="zh-CN">` 上，Pagefind 按 `lang` 分索引，这样以后的 `/en/` 不会被硬编码成中文。如果中文分词效果不够，可以改成：

```bash
npx pagefind --site dist --force-language zh
```

单独重建索引：

```bash
npm run pagefind
```

开发服务器：`npm run dev`。

## 内容

正文在 `src/content/`，schema 在 `src/content.config.ts`（对应方案 §3.2）。目录：

- `daily/zh/`、`xscan/zh/`、`articles/zh/`、`gamedev/zh/`
- 每个栏目下的 `en/` 先留空

`draft: true` 的条目不会出现在页面和 RSS 里。`articles/zh/draft-example.md` 和 `gamedev/zh/draft-example.md` 是这种草稿，只为了让空栏目的 schema 在构建时被加载；有正式稿件后可以删掉。`quiet_day: true` 的日报详情页会输出 `noindex`，并且不进 RSS。

## 公开仓库

本仓库公开。不要提交密钥、令牌、`.env`、`secrets/`、抓取缓存或 `seen.json`。Cloudflare 与 GitHub Actions 的凭据只放在托管平台的 Secrets 里，不要写进仓库，也不要在这里绑定域名或 DNS。

# 狐闻

Public site for **狐闻** at [news.zool.me](https://news.zool.me). Chinese-first: the default locale is `zh` with `prefixDefaultLocale: true`, so the site lives under `/zh/`. `/` meta-refreshes to `/zh/`. `/en/` is reserved (empty content dirs plus `/en/rss.xml`) and has no pages yet.

Pinned to Astro **5.18.2**, the latest stable 5.x. `astro@latest` on npm is 7.x; do not upgrade this repo onto that line by accident.

## Install and build

Node.js 18.20.8, 20.3+, or 22+.

```bash
npm ci
npm run build
npm run preview
```

`npm run build` runs `astro build` and then `pagefind --site dist`, writing the search index to `dist/pagefind/`. Pages set `<html lang="zh-CN">` so Pagefind can split indexes by language when `/en/` arrives. If Chinese segmentation is weak, rerun with `npx pagefind --site dist --force-language zh`.

## Content

Markdown lives in `src/content/`. The Zod schema is `src/content.config.ts`. `draft: true` entries are omitted from pages and RSS. `articles/zh/draft-example.md` and `gamedev/zh/draft-example.md` are unpublished schema fixtures and can be deleted once real posts exist. Daily entries with `quiet_day: true` are `noindex` and left out of RSS.

## Public repository

This repository is public. Never commit secrets, tokens, `.env` files, `secrets/`, scrape caches, or `seen.json`. Keep Cloudflare and GitHub Actions credentials in the host's secret store. Do not bind a domain or change DNS from this repo.
