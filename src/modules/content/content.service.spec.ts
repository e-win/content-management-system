import { Test, TestingModule } from '@nestjs/testing';
import { FileModule } from '../file/file.module';
import { ContentService } from './content.service';
import { FileService } from '../file/file.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContentEntity } from './content.entity';
import { PaginationParmas } from '../../shared/pagination.dto';

const mockContentEntity = {
  findAndCount: jest.fn(),
};

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      //   imports: [FileService],
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(ContentEntity),
          useValue: mockContentEntity,
        },
        FileService,
      ],
    }).compile();
    service = app.get<ContentService>(ContentService);
  });

  describe('getContents', () => {
    it('should return empty data if no content', async () => {
      mockContentEntity.findAndCount.mockResolvedValueOnce([[], 0]);
      const result = await service.getContents(
        'some-userId',
        new PaginationParmas(),
      );
      expect(result.data).toEqual([]);
      expect(result.metadata.total).toBe(0);
    });
    it('should return files with correct path', async () => {
      const mockDbResult: [ContentEntity[], number] = [
        [
          {
            authorId: 'some-id',
            createdAt: new Date(),
            fileName: 'file1',
            fileUrl: 'file1',
            id: 1,
            updatedAt: new Date(),
          },
          {
            authorId: 'some-id',
            createdAt: new Date(),
            fileName: 'file2',
            fileUrl: 'file2',
            id: 2,
            updatedAt: new Date(),
          },
        ],
        2,
      ];
      const getHostedFileWithFileUrlSpy = jest.spyOn(
        FileService.prototype,
        'getHostedFileWithFileUrl',
      );
      mockContentEntity.findAndCount.mockResolvedValueOnce(mockDbResult);

      const result = await service.getContents(
        'some-userId',
        new PaginationParmas(),
      );

      expect(getHostedFileWithFileUrlSpy).toHaveBeenCalledTimes(2);
      // should transform fileUrl
      expect(result.data).not.toEqual(mockDbResult[0]);
      expect(result.metadata.total).toBe(mockDbResult[1]);
    });
  });
});
