import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const folder = req.body.folder || 'common';
      const uploadPath = `uploads/${folder}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        extname(file.originalname);

      cb(null, uniqueName);
    },
  }),
};
