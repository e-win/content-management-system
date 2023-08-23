import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentEntity } from './content.entity';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([ContentEntity])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
