import { Injectable, NestMiddleware } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(socket: Socket, next: (err?: any) => void) {
    const token = socket.handshake.auth?.token;

    try {
      const decoded = this.jwtService.verify(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  }
}
