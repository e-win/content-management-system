import { Test } from '@nestjs/testing';
import { FileService } from '../file/file.service';
import { isUUID } from 'class-validator';
import * as fs from 'fs';

describe('ContentService', () => {
  let service: FileService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      //   imports: [FileService],
      providers: [FileService],
    }).compile();
    service = app.get<FileService>(FileService);
  });

  describe('uploadFile', () => {
    const mockBinaryFile = {
      buffer: Buffer.from('some-data'),
      mimetype: 'image/png',
      filename: 'imageFile.png',
      originalname: 'some-oriname.png',
    };
    it('should call fs.writeFile', async () => {
      const writeFileSpy = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation((_, __, cb) => {
          cb(null);
        });
      jest.mock('fs', () => {});

      const result = await service.uploadFile(
        mockBinaryFile as Express.Multer.File,
      );

      expect(result.split('.')[1]).toBe('png');
      expect(isUUID(result.split('.')[0])).toBeTruthy();
      expect(writeFileSpy).toBeCalled();
    });
  });
});
