import Redis from 'ioredis';

let redis: Redis | null = null;

// Redis连接配置
export const initRedis = () => {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    redis.on('close', () => {
      console.log('⚠️  Redis connection closed');
    });
  } else {
    console.log('⚠️  Redis not configured, running without cache');
  }

  return redis;
};

// 获取Redis实例
export const getRedis = (): Redis | null => {
  return redis;
};

// 缓存辅助函数
export const cache = {
  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;

    try {
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  // 设置缓存
  async set(key: string, value: any, ttl: number = 300): Promise<boolean> {
    if (!redis) return false;

    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  // 删除缓存
  async del(key: string): Promise<boolean> {
    if (!redis) return false;

    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  },

  // 删除匹配的缓存
  async delPattern(pattern: string): Promise<boolean> {
    if (!redis) return false;

    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delPattern error:', error);
      return false;
    }
  },

  // 清空所有缓存
  async flush(): Promise<boolean> {
    if (!redis) return false;

    try {
      await redis.flushall();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
};

export default redis;