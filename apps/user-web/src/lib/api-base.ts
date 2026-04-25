const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const normalized = trimTrailingSlash(rawBase);

  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};
