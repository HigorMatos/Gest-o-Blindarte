export function getPagination(page = 1, pageSize = 20) {
  const safePage = Math.max(1, Number(page));
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize)));
  return {
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
    page: safePage,
    pageSize: safePageSize,
  };
}
