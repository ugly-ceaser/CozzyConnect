import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MiddlewareService implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Skip middleware for WebSocket upgrade requests
    if (req.headers['upgrade'] === 'websocket') {
      console.log('websocket')
      return next();
    }

    // Log the raw request body for non-WebSocket requests
    console.log('Raw Request Body:', req.body);
    next();
  }
}