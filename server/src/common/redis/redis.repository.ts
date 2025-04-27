import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from './redis.config';

@Injectable()
export class RedisRepository {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(redisConfig);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, seconds?: number) {
    if (seconds) return this.redisClient.set(key, value, 'EX', seconds);
    return this.redisClient.set(key, value);
  }
}
