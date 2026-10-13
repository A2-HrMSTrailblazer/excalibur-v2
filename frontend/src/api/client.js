export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Small fetch wrapper for the Fastify API.
 * - `body` is sent as JSON, `form` (FormData) as multipart.
 * - Non-2xx responses throw ApiError with the server's message.
 */
export async function api(path, { method = 'GET', body, form } = {}) {
  const options = { method, credentials: 'same-origin', headers: {} };
  if (form) {
    options.body = form;
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`/api${path}`, options);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.message || `Request failed (${res.status})`);
  return data;
}

/** Builds "?a=1&b=2" from an object, skipping empty values and expanding arrays. */
export function toQuery(params) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const list = Array.isArray(value) ? value : [value];
    for (const v of list) {
      if (v !== undefined && v !== null && v !== '') qs.append(key, v);
    }
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}
