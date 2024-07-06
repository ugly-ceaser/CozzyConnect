// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from '../socket.io/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
