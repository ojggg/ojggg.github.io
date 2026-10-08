export const PAGE_SIZE = 10;

export function matchTitle(title: string, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase("ko");
  if (needle.length === 0) {
    return true;
  }
  return title.toLocaleLowerCase("ko").includes(needle);
}

export function pageOf<T>(items: T[], page: number, pageSize = PAGE_SIZE): {
  page: number;
  pages: number;
  items: T[];
} {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * pageSize;
  return {
    page: current,
    pages,
    items: items.slice(start, start + pageSize),
  };
}
