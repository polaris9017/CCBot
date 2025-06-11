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
      const authHeader = client.handshake.auth.token as string;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      console.log(`[ChatGateway] Connection attempt from user: ${userId}`);

      if (!userId || !token) {
        console.log('[ChatGateway] Missing userId or token');
        client.disconnect();
        return;
      }

      let tokenPayload;
      try {
        tokenPayload = this.jwtService.verify(token);
      } catch (error) {
        console.error('[ChatGateway] Token verification failed:', error);
        client.disconnect();
        return;
      }
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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query?.id as string;
    if (userId) {
      console.log(`[ChatGateway] Disconnecting user: ${userId}`);
      this.clients.delete(userId);

      const externalSocket = this.externalSockets.get(userId);
      if (externalSocket) {
        try {
          if (externalSocket.connected) externalSocket.disconnect();
          this.externalSockets.delete(userId);
          console.log(`[ChatGateway] External socket cleaned up for user ${userId}`);
        } catch (error) {
          console.error(
            `[ChatGateway] Error cleaning up external socket for user ${userId}:`,
            error
          );
        }
      }

      console.log(`[ChatGateway] ${userId} disconnected`);
    }
  }

  private async setupExternalSocket(userId: string) {
    try {
      const existingSocket = this.externalSockets.get(userId);
      if (existingSocket && existingSocket.connected) {
        existingSocket.disconnect();
        this.externalSockets.delete(userId);
      }

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

      const connectTimeout = setTimeout(() => {
        if (!externalSocket.connected) {
          console.error(`[ChatGateway] External socket connection timed out for user ${userId}`);
          externalSocket.disconnect();
          this.externalSockets.delete(userId);
        }
      }, 10000);

      externalSocket.on('connect', () => {
        clearTimeout(connectTimeout);
        console.log(`[ChatGateway] External socket connected for user ${userId}`);
      });

      externalSocket.on('connect_error', (error: any) => {
        clearTimeout(connectTimeout);
        console.error(`[ChatGateway] External socket connection error for user ${userId}:`, error);
        this.externalSockets.delete(userId);
      });

      externalSocket.on('SYSTEM', async (payload: any) => {
        try {
          await this.handleSystemMessage(payload, userId);
        } catch (error) {
          console.error(`[ChatGateway] Error handling system message for user ${userId}:`, error);
        }
      });

      externalSocket.on('disconnect', (reason: string) => {
        clearTimeout(connectTimeout);
        console.log(`[ChatGateway] External socket disconnected for user ${userId}:`, reason);
        this.externalSockets.delete(userId);
      });

      externalSocket.on('CHAT', (payload: any) => {
        try {
          this.emitToUser(userId, 'CHAT', payload);
        } catch (error) {
          console.error(`[ChatGateway] Error handling chat message for user ${userId}:`, error);
        }
      });

      externalSocket.on('DONATION', (payload: any) => {
        try {
          this.emitToUser(userId, 'DONATION', payload);
        } catch (error) {
          console.error(`[ChatGateway] Error handling donation message for user ${userId}:`, error);
        }
      });
    } catch (error) {
      console.error('[ChatGateway] External socket setup error:', error);
    }
  }

  private async handleSystemMessage(payload: any, userId: string) {
    try {
      const parsedPayload = JSON.parse(payload) as SocketSystemMessage;
      if (parsedPayload.data.sessionKey && parsedPayload.type === 'connected') {
        const sessionKey = parsedPayload.data.sessionKey;
        const accessToken = await this.redisRepository.get(`accessToken/chzzk:${userId}`);

        if (!accessToken) {
          console.error(`[ChatGateway] No access token found or expired for user ${userId}`);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };

        const subscriptionPromises = [
          await axios.post(
            `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/chat?sessionKey=${sessionKey}`,
            null,
            {
              headers,
              timeout: 5000,
            }
          ),
          await axios.post(
            `https://openapi.chzzk.naver.com/open/v1/sessions/events/subscribe/donation?sessionKey=${sessionKey}`,
            null,
            {
              headers,
              timeout: 5000,
            }
          ),
        ];

        await Promise.allSettled(subscriptionPromises);
      }

      if (parsedPayload.type === 'subscribed') {
        if (parsedPayload.data.eventType === 'CHAT') console.log('Chat event subscribed!');
        if (parsedPayload.data.eventType === 'DONATION') console.log('Donation event subscribed!');
      }
    } catch (error) {
      console.error('[ChatGateway] Subscription error:', error);
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(event, data);
    }
  }
}
