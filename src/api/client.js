const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  // Ensure BASE_URL doesn't have a trailing slash and endpoint starts with a slash
  const cleanBaseUrl = BASE_URL.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      : data.detail || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
