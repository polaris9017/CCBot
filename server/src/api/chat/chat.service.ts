import { Injectable, OnModuleInit } from '@nestjs/common';
import * as io from 'socket.io-client';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService implements OnModuleInit {
  private socket: SocketIOClient.Socket;
  private sessionKey: string | null = null;

  constructor(private readonly chatGateway: ChatGateway) {}

  onModuleInit() {
    const socketUrl = ''; // TODO: Auth 모듈에서 세션 URL 불러올것
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

    this.socket.on('SYSTEM', (payload: any) => {
      if (payload?.type === 'connected' && payload?.data?.sessionKey) {
        this.sessionKey = payload.data.sessionKey;
      }
      // TODO: 이벤트 구독 로직 추가
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected chat session!');
    });

    this.socket.on('CHAT', () => {
      // TODO: 채팅 메시지 처리
    });

    this.socket.on('DONATION', () => {
      // TODO: 도네 메시지 처리
    });
  }
}
