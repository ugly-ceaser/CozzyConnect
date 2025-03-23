import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { NotFoundFilter } from './not-found.filter'; // Import the filter
import { BlockingIoAdapter } from './middleware/blocking.io-adapter';
import { ChatService } from './chat/chat.service';

class JwtIoAdapter extends IoAdapter {
  private readonly logger = new Logger(JwtIoAdapter.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);

    // Add middleware for WebSocket authentication
    server.use(async (socket: Socket, next) => {
      const token = socket.handshake.query.token as string;
      if (token) {
        try {
          // Verify the JWT token
          const payload = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
          });
          // Attach the user payload to the socket
          socket.data.user = payload;
          this.logger.log(`User ${payload.sub} connected`);
          next();
        } catch (err) {
          this.logger.error('Authentication error:', err.message);
          next(new Error('Authentication error'));
        }
      } else {
        this.logger.error('No token provided');
        next(new Error('Authentication error'));
      }
    });

    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP and WebSocket connections
  app.enableCors({
    origin: true, // Allow all origins (you can specify specific origins if needed)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and credentials
  });

  // Get instances of ConfigService and JwtService
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  // Use the custom JwtIoAdapter for WebSocket connections
  app.useWebSocketAdapter(new JwtIoAdapter(jwtService, configService));

  // Use cookie-parser middleware for handling cookies
  app.use(cookieParser());

  // Global validation pipe for request payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out non-whitelisted properties
    }),
  );

  // Apply the global exception filter for 404 errors
  app.useGlobalFilters(new NotFoundFilter());

  const chatService = app.get(ChatService);
  app.useWebSocketAdapter(new BlockingIoAdapter(app, chatService));

  // Start the application on port 3000
  await app.listen(3000);
  Logger.log('Application is running on port 3000');
}

bootstrap();