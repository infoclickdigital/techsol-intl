// Central in-memory cache manager for static CMS content
let cachedData: any = null;
let lastFetchedAt = 0;
const CACHE_TTL = 300000; // 5 minutes TTL

export function getCachedData() {
  return cachedData;
}

export function setCachedData(data: any) {
  cachedData = data;
  lastFetchedAt = Date.now();
}

export function isCacheValid(): boolean {
  if (!cachedData) return false;
  return Date.now() - lastFetchedAt < CACHE_TTL;
}

export function invalidateCache() {
  cachedData = null;
  lastFetchedAt = 0;
}
