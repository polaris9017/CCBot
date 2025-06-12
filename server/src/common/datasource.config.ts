import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
});

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'migrations',
  migrations: ['src/migrations/*.ts'],
});
