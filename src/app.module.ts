import { Module } from '@nestjs/common';
import { FileModule } from './modules/file/file.module';
import { ContentModule } from './modules/content/content.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logger.interceptors';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ContentEntity } from './modules/content/content.entity';

@Module({
  imports: [
    FileModule,
    ContentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      synchronize: true,
      entities: [ContentEntity],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '.', 'assets'),
      serveStaticOptions: { index: false },
      serveRoot: '/assets',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
