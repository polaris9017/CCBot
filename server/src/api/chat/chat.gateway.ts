import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import io from 'socket.io-client';
import { RedisRepository } from '../../common/redis/redis.repository';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private socket: SocketIOClient.Socket;
  private sessionKey: string | null = null;
  private clients = new Map<string, Socket>();
  private userId: string = '';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisRepository: RedisRepository
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.userId = client.handshake.query?.id as string;
    const token = (client.handshake.headers?.authorization as string).split(' ')[1];
    const userInfoFromToken = await this.userService.findUserByUID(
      this.jwtService.verify(token)?.id
    );
    if (this.userId && userInfoFromToken?.uid === this.userId) {
      this.clients.set(this.userId, client);
      console.log(`[ChatGateway] ${this.userId} connected`);
    } else {
      console.log('[ChatGateway] User not found. Disconnecting...');
      client.disconnect();
    }

    const sessionResponse = await axios.get(
      'https://openapi.chzzk.naver.com/open/v1/sessions/auth',
      {
        headers: {
          Authorization: `Bearer ${await this.redisRepository.get(`accessToken/chzzk:${this.getUserId()}`)}`,
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
      this.emitToUser(this.userId, 'CHAT', payload?.data);
    });

    this.socket.on('DONATION', (payload: any) => {
      // TODO: 도네 메시지 처리
      this.emitToUser(this.userId, 'DONATION', payload?.data);
    });
  }

  getUserId() {
    return this.userId;
  }

  emitToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(event, data);
    }
  }
}
