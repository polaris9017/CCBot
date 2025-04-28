import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as io from 'socket.io-client';
import { ChatGateway } from './chat.gateway';
import { RedisRepository } from 'src/common/redis/redis.repository';

@Injectable()
export class ChatService implements OnModuleInit {
  private socket: SocketIOClient.Socket;
  private sessionKey: string | null = null;

  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly redisRepository: RedisRepository
  ) {}

  async onModuleInit() {
    const sessionResponse = await axios.get(
      'https://openapi.chzzk.naver.com/open/v1/sessions/auth',
      {
        headers: {
          Authorization: `Bearer ${await this.redisRepository.get(`accessToken/chzzk:${this.chatGateway.getUserId()}`)}`,
        },
      }
    );
    const socketUrl = sessionResponse.data?.url;
    const socketOptions: SocketIOClient.ConnectOpts = {
      reconnection: false,
      forceNew: true, //'force new connection': true,
      timeout: 3000, //'connect timeout': 3000,
      transports: ['websocket'],
    };

    this.socket = io(socketUrl, socketOptions);

    this.socket.on('connect', () => {
      console.log('Connected chat session!');
    });

    this.socket.on('SYSTEM', async (payload: any) => {
      if (payload?.data?.sessionKey) {
        if (payload?.type === 'connected') {
          this.sessionKey = payload.data.sessionKey;
          await axios.post(
            `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/chat?sessionKey=${this.sessionKey}`
          );
          await axios.post(
            `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/donation?sessionKey=${this.sessionKey}`
          );
        }

        if (payload?.type === 'subscribed') {
          if (payload?.data?.eventType === 'CHAT') console.log('Chat event subscribed!');
          if (payload?.data?.eventType === 'DONATION') console.log('Donation event subscribed!');
        }
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected chat session!');
    });

    this.socket.on('CHAT', (payload: any) => {
      // TODO: 채팅 메시지 처리
      this.chatGateway.server.emit('CHAT', payload?.data);
    });

    this.socket.on('DONATION', (payload: any) => {
      // TODO: 도네 메시지 처리
      this.chatGateway.server.emit('DONATION', payload?.data);
    });
  }
}
