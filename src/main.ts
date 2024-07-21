import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { NotFoundFilter } from './not-found.filter'; // Import the filter

class JwtIoAdapter extends IoAdapter {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {
    super();
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    server.use(async (socket: Socket, next) => {
      const token = socket.handshake.query.token as string;
      if (token) {
        try {
          const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
          });
          socket.data.user = payload;
          next();
        } catch (err) {
          next(new Error('Authentication error'));
        }
      } else {
        next(new Error('Authentication error'));
      }
    });

    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  app.useWebSocketAdapter(new JwtIoAdapter(jwtService, configService));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Apply the global exception filter
  app.useGlobalFilters(new NotFoundFilter());

  await app.listen(3000);
}

bootstrap();
