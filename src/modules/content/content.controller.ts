import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ALLOWED_CONTENT_FILE_TYPES,
  MAX_CONTENT_FILE_SIZE_IN_MB,
} from './content.const';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContentDto } from './content.dto';
import { ContentEntity } from './content.entity';
import { PaginatedData, PaginationParmas } from '../../shared/pagination.dto';
import { mbToBytes } from '../../shared/helper';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiResponse({
    description: 'Paginated contents',
    type: PaginatedData<ContentEntity>,
  })
  @ApiOperation({ operationId: 'getContents' })
  @Get()
  getContent(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    paginationParams: PaginationParmas,
    @Headers('userId') userId: string,
  ) {
    console.log(paginationParams);
    return this.contentService.getContents(userId, paginationParams);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileName: { type: 'string', example: 'File title' },
        file: {
          type: 'string',
          format: 'binary',
        },
        description: { type: 'string', nullable: true },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: mbToBytes(MAX_CONTENT_FILE_SIZE_IN_MB),
            message: `expected size is less than ${MAX_CONTENT_FILE_SIZE_IN_MB}MB`,
          }),
          new FileTypeValidator({ fileType: ALLOWED_CONTENT_FILE_TYPES }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: ContentDto,
    @Headers('userId') userId: string,
  ) {
    return await this.contentService.uploadContent(file, body, userId);
  }
}
