import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RedisRepository } from 'src/common/redis/redis.repository';

@Module({
  providers: [ChatGateway, ChatService, RedisRepository],
})
export class ChatModule {}
