import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { dirname, extname, join, relative, sep } from 'path';
import { allowedFileTypes, sanitizeFolder } from 'src/common/multer.config';

@Injectable()
export class UploadService {
  async buildUploadResponse(file: Express.Multer.File, folder?: string) {
    await this.validateStoredFile(file);

    const uploadFolder = this.getUploadFolder(file, folder);

    return {
      success: true,
      fileName: file.filename,
      fileUrl: `/uploads/${uploadFolder}/${file.filename}`,
    };
  }

  private async validateStoredFile(file: Express.Multer.File): Promise<void> {
    const extension = extname(file.originalname).toLowerCase();
    const allowedMimeTypes = allowedFileTypes.get(extension);

    if (!allowedMimeTypes?.includes(file.mimetype)) {
      await this.removeInvalidUpload(file);
      throw new BadRequestException(
        'Invalid file type. Only images and PDF files are allowed.',
      );
    }

    const buffer = await fs.readFile(file.path);

    if (!this.hasValidSignature(buffer, extension)) {
      await this.removeInvalidUpload(file);
      throw new BadRequestException('Invalid file content.');
    }
  }

  private hasValidSignature(buffer: Buffer, extension: string): boolean {
    if (extension === '.pdf') {
      return buffer.subarray(0, 4).toString('ascii') === '%PDF';
    }

    if (extension === '.jpg' || extension === '.jpeg') {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (extension === '.png') {
      return buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }

    if (extension === '.gif') {
      const signature = buffer.subarray(0, 6).toString('ascii');

      return signature === 'GIF87a' || signature === 'GIF89a';
    }

    if (extension === '.webp') {
      return (
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    }

    return false;
  }

  private getUploadFolder(file: Express.Multer.File, folder?: string): string {
    const uploadsRoot = join(process.cwd(), 'uploads');
    const relativeFolder = relative(uploadsRoot, dirname(file.path));

    if (!relativeFolder || relativeFolder.startsWith('..')) {
      return sanitizeFolder(folder);
    }

    return relativeFolder.split(sep).map(sanitizeFolder).join('/');
  }

  private async removeInvalidUpload(file: Express.Multer.File): Promise<void> {
    if (!file.path) {
      return;
    }

    await fs.unlink(file.path).catch(() => undefined);
  }
}
