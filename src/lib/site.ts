export const SITE_URL = 'https://news.zool.me';
export const SITE_NAME = '开发者简报';
export const SITE_DESCRIPTION =
  'Bevy 与游戏开发的中文简报：Wiki 日报、社区动态、长文和游戏开发周报。';

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function shanghaiDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
