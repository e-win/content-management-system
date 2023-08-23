import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { getHostUrl } from '../../shared/const';

@Injectable()
export class FileService {
  private FILES_DIRECTORY = 'assets';

  private makeFilePath(fileName: string) {
    return join(__dirname, '../..', this.FILES_DIRECTORY, fileName);
  }

  public getHostedFileWithFileUrl(fileUrl: string) {
    return [getHostUrl(), this.FILES_DIRECTORY, fileUrl].join('/');
  }

  async uploadFile(file: Express.Multer.File) {
    const fileType = file.originalname.split('.').pop();
    const fileName = randomUUID() + '.' + fileType;

    await new Promise((resolve) =>
      fs.writeFile(this.makeFilePath(fileName), file.buffer, resolve),
    );

    return fileName;
  }
}
