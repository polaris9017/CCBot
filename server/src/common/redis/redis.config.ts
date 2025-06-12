import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
});

export const redisConfig = {
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string),
  password: process.env.REDIS_PASSWORD as string,
};
