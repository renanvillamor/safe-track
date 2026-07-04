import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "safetrack:cache:";

interface CacheEnvelope<T> {
  data: T;
  cachedAt: string;
}

export async function readCache<T>(key: string): Promise<CacheEnvelope<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEnvelope<T>;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const envelope: CacheEnvelope<T> = { data, cachedAt: new Date().toISOString() };
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(envelope));
  } catch {
    // best-effort cache; ignore storage failures (e.g. quota exceeded)
  }
}
