import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from './content.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { FileService } from '../file/file.service';
import { ContentDto } from './content.dto';
import { PaginatedData, PaginationParmas } from '../../shared/pagination.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    private readonly fileService: FileService,
  ) {}

  async uploadContent(
    file: Express.Multer.File,
    createContentInput: ContentDto,
    userId: string,
  ) {
    const fileUrl = await this.fileService.uploadFile(file);

    const content = this.contentRepository.create({
      authorId: userId,
      fileUrl,
      fileName: createContentInput.fileName,
      description: createContentInput.description,
    });

    const savedContent = await this.contentRepository.save(content);
    return savedContent;
  }

  async getContents(userId: string, pagination: PaginationParmas) {
    const [contents, total] = await this.contentRepository.findAndCount({
      where: { authorId: userId },
      take: pagination.perPage,
      skip: (pagination.page - 1) * pagination.perPage,
    });

    const contentsWithFileUrl = contents.map(({ fileUrl, ...content }) => ({
      ...content,
      fileUrl: this.fileService.getHostedFileWithFileUrl(fileUrl),
    }));

    return new PaginatedData(contentsWithFileUrl, {
      total,
      page: pagination.page,
      perPage: pagination.perPage,
    });
  }
}
