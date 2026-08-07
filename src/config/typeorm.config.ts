import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  port: +configService.get<string>('DB_PORT')!,
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  entities: ['src/**/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
});

export default AppDataSource;
