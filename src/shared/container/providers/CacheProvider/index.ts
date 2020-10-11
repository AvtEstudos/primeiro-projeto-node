import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import RedisCacheProvier from './implementations/RedisCacheProvier';

const providers = {
  redis: RedisCacheProvier,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
