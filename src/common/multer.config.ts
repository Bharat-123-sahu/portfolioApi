import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import { getNumberEnv } from 'src/config/env.config';

export const allowedFileTypes = new Map<string, string[]>([
  ['.jpg', ['image/jpeg']],
  ['.jpeg', ['image/jpeg']],
  ['.png', ['image/png']],
  ['.webp', ['image/webp']],
  ['.gif', ['image/gif']],
  ['.pdf', ['application/pdf']],
]);

const maxFileSize = getNumberEnv('UPLOAD_MAX_FILE_SIZE', 5 * 1024 * 1024);

export function sanitizeFolder(folder: string | undefined): string {
  const sanitizedFolder = (folder || 'common')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitizedFolder || 'common';
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(extname(fileName), '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const folder = sanitizeFolder(req.body.folder);
      req.body.folder = folder;
      const uploadPath = join(process.cwd(), 'uploads', folder);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const extension = extname(file.originalname).toLowerCase();
      const safeName = sanitizeFileName(file.originalname) || 'file';
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        '-' +
        safeName +
        extension;

      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase();
    const allowedMimeTypes = allowedFileTypes.get(extension);

    if (!allowedMimeTypes?.includes(file.mimetype)) {
      cb(
        new BadRequestException(
          'Invalid file type. Only images and PDF files are allowed.',
        ),
        false,
      );
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: maxFileSize,
    files: 1,
  },
};
