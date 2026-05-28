import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

@Injectable()
export class AppCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppCacheService.name);
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries = this.getMaxEntries();
  private redis?: Redis;
  private redisAvailable = false;

  onModuleInit() {
    if (!process.env.REDIS_URL) {
      return;
    }

    this.redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    this.redis.on('ready', () => {
      this.redisAvailable = true;
      this.logger.log('Redis cache connected.');
    });

    this.redis.on('error', (error) => {
      this.redisAvailable = false;
      this.logger.warn(`Redis cache unavailable: ${error.message}`);
    });

    void this.redis.connect().catch((error) => {
      this.redisAvailable = false;
      this.logger.warn(`Redis cache connection failed: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit().catch(() => undefined);
    }
  }

  private getMaxEntries() {
    const maxEntries = Number(process.env.APP_CACHE_MAX_ENTRIES || 500);
    return Number.isFinite(maxEntries) && maxEntries > 0 ? maxEntries : 500;
  }

  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (this.redisAvailable && this.redis) {
      try {
        const cached = await this.redis.get(key);
        return cached === null ? undefined : (JSON.parse(cached) as T);
      } catch (error) {
        this.redisAvailable = false;
        this.logger.warn(
          `Redis cache read failed: ${(error as Error).message}`,
        );
      }
    }

    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number) {
    if (ttlSeconds <= 0) return;

    if (this.redisAvailable && this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (error) {
        this.redisAvailable = false;
        this.logger.warn(
          `Redis cache write failed: ${(error as Error).message}`,
        );
      }
    }

    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async deleteByPrefix(prefix: string) {
    if (this.redisAvailable && this.redis) {
      try {
        let cursor = '0';
        do {
          const [nextCursor, keys] = await this.redis.scan(
            cursor,
            'MATCH',
            `${prefix}*`,
            'COUNT',
            100,
          );
          cursor = nextCursor;
          if (keys.length) {
            await this.redis.del(...keys);
          }
        } while (cursor !== '0');
      } catch (error) {
        this.redisAvailable = false;
        this.logger.warn(
          `Redis cache invalidation failed: ${(error as Error).message}`,
        );
      }
    }

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async clear() {
    if (this.redisAvailable && this.redis) {
      await this.redis.flushdb().catch((error) => {
        this.logger.warn(`Redis cache clear failed: ${error.message}`);
      });
    }
    this.store.clear();
  }

  static stableKey(namespace: string, value: unknown) {
    return `${namespace}:${AppCacheService.stableStringify(value)}`;
  }

  private static stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => AppCacheService.stableStringify(item)).join(',')}]`;
    }

    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${AppCacheService.stableStringify(record[key])}`,
      )
      .join(',')}}`;
  }
}
