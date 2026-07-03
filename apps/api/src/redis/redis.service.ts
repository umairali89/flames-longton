import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

interface KvStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  disconnect(): void;
}

class MemoryKvStore implements KvStore {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  disconnect() {}
}

class RedisKvStore implements KvStore {
  constructor(private client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  disconnect() {
    this.client.disconnect();
  }
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly store: KvStore;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const redisUrl = process.env.REDIS_URL?.trim();
    if (!redisUrl || redisUrl === 'memory') {
      this.store = new MemoryKvStore();
      this.logger.warn('Using in-memory cart store (set REDIS_URL for persistent carts)');
      return;
    }

    const client = new Redis(redisUrl, { maxRetriesPerRequest: 1 });
    client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
    this.store = new RedisKvStore(client);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    await this.store.set(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.store.del(key);
  }

  onModuleDestroy() {
    this.store.disconnect();
  }
}
