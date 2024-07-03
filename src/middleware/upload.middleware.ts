// src/upload/upload.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private multer;

  constructor() {
    this.multer = multer({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }).array('files'); // Change to .single('file') for single file uploads
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.multer(req, res, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      next();
    });
  }
}
