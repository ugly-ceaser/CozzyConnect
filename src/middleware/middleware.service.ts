import { Injectable, NestMiddleware } from '@nestjs/common';
import {  Request, Response, NextFunction } from 'express';

@Injectable()
export class MiddlewareService implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        console.log('Raw Request Body:', req.body);
        next();
      }
}
