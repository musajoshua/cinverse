import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { ActorsModule } from './actors/actors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthNGuard } from './common/guards/authn/authn.guard';
import { RoleGuard } from './common/guards/role/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    MoviesModule,
    GenresModule,
    ActorsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthNGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
