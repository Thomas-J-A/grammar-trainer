import { Module } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './redis.contants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        try {
          // Create Redis client
          const redisClient = Redis.createClient({
            url: `redis://${configService.get<string>(
              'cache.host'
            )}:${configService.get<number>('cache.port')}`,
          });

          // Make connection to Redis instance
          await redisClient.connect();
          console.log('Connected to Redis');

          // Return reference to client for use in other modules
          return redisClient;
        } catch (e) {
          console.log(`Unable to connect to Redis: ${e.code}`);

          // Exit process since a successful Redis connection
          // is essential to correct functioning of app
          process.exit(1);
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
