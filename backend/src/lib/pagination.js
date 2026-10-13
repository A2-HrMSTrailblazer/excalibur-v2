export function parsePaging(query, defaultLimit = 10) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, offset: (page - 1) * limit };
}

/**
 * Rows must include a `total_count` column (COUNT(*) OVER ()).
 * Returns the same paging fields the old EJS pagination partial used.
 */
export function toPage(rows, { page, limit }, mapRow = (r) => r) {
  const totalItems = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const windowSize = 2;
  return {
    items: rows.map(mapRow),
    page,
    limit,
    totalItems,
    totalPages,
    startPage: Math.max(1, page - windowSize),
    endPage: Math.min(totalPages, page + windowSize),
  };
}

export const likePattern = (search) => `%${String(search || '').trim()}%`;
