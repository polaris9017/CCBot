import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import axios from 'axios';
import * as io from 'socket.io-client';
import { RedisRepository } from '../../common/redis/redis.repository';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

interface SocketSystemMessage {
  type: string;
  data: { sessionKey?: string; eventType?: string; channelId?: string };
}

@WebSocketGateway(4001, {
  namespace: 'chat',
  cors: true,
  compression: false,
  perMessageDeflate: false,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private externalSockets = new Map<string, SocketIOClient.Socket>();
  private clients = new Map<string, Socket>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisRepository: RedisRepository
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.handshake.query?.id as string;
      const token = (client.handshake.headers?.authorization as string)?.split(' ')[1];

      if (!userId || !token) {
        console.log('[ChatGateway] Missing userId or token');
        client.disconnect();
        return;
      }

      const tokenPayload = this.jwtService.verify(token);
      const userInfoFromToken = await this.userService.findUserByUID(tokenPayload?.id);

      if (!userInfoFromToken || userInfoFromToken.uid !== userId) {
        console.log('[ChatGateway] User not found or ID mismatch. Disconnecting...');
        client.disconnect();
        return;
      }

      this.clients.set(userId, client);
      console.log(`[ChatGateway] ${userId} connected`);

      await this.setupExternalSocket(userId);
    } catch (error) {
      console.error('[ChatGateway] Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query?.id as string;
    if (userId) {
      this.clients.delete(userId);

      const externalSocket = this.externalSockets.get(userId);
      if (externalSocket) {
        externalSocket.disconnect();
        this.externalSockets.delete(userId);
      }

      console.log(`[ChatGateway] ${userId} disconnected`);
    }
  }

  private async setupExternalSocket(userId: string) {
    try {
      const accessToken = await this.redisRepository.get(`accessToken/chzzk:${userId}`);
      if (!accessToken) {
        console.error(`[ChatGateway] No access token found for user ${userId}`);
        return;
      }

      const sessionResponse = await axios.get(
        'https://openapi.chzzk.naver.com/open/v1/sessions/auth',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const socketUrl = sessionResponse.data?.content?.url;
      if (!socketUrl) {
        console.error('[ChatGateway] No socket URL received');
        return;
      }

      // Socket.IO v2 호환 옵션
      const socketOptions = {
        reconnection: false,
        forceNew: true,
        timeout: 3000,
        transports: ['websocket'],
        // v2 서버를 위한 추가 옵션
        autoConnect: true,
        jsonp: false,
      };

      const externalSocket = io(socketUrl, socketOptions);
      this.externalSockets.set(userId, externalSocket);

      externalSocket.on('connect', () => {
        console.log(`[ChatGateway] External socket connected for user ${userId}`);
      });

      externalSocket.on('connect_error', (error: any) => {
        console.error(`[ChatGateway] External socket connection error for user ${userId}:`, error);
      });

      externalSocket.on('SYSTEM', async (payload: any) => {
        await this.handleSystemMessage(payload, userId);
      });

      externalSocket.on('disconnect', (reason: string) => {
        console.log(`[ChatGateway] External socket disconnected for user ${userId}:`, reason);
      });

      externalSocket.on('CHAT', (payload: any) => {
        this.emitToUser(userId, 'CHAT', payload);
      });

      externalSocket.on('DONATION', (payload: any) => {
        this.emitToUser(userId, 'DONATION', payload);
      });
    } catch (error) {
      console.error('[ChatGateway] External socket setup error:', error);
    }
  }

  private async handleSystemMessage(payload: any, userId: string) {
    const parsedPayload = JSON.parse(payload) as SocketSystemMessage;
    if (parsedPayload.data.sessionKey && parsedPayload.type === 'connected') {
      const sessionKey = parsedPayload.data.sessionKey;

      try {
        await axios.post(
          `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/chat?sessionKey=${sessionKey}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await this.redisRepository.get(`accessToken/chzzk:${userId}`)}`,
            },
          }
        );
        await axios.post(
          `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/donation?sessionKey=${sessionKey}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await this.redisRepository.get(`accessToken/chzzk:${userId}`)}`,
            },
          }
        );
      } catch (error) {
        console.error('[ChatGateway] Subscription error:', error);
      }
    }

    if (parsedPayload.type === 'subscribed') {
      if (parsedPayload.data.eventType === 'CHAT') console.log('Chat event subscribed!');
      if (parsedPayload.data.eventType === 'DONATION') console.log('Donation event subscribed!');
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(event, data);
    }
  }
}
