import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    // 注入的 REDIS_CLIENT ， 在 module 中引入
    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            // 设置过期时间
            await this.redisClient.expire(key, ttl);
        }
    }
}
