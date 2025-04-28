import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();
  private userId: string = '';

  handleConnection(@ConnectedSocket() client: Socket) {
    this.userId = client.handshake.query?.id as string;
    if (this.userId) {
      this.clients.set(this.userId, client);
      console.log(`[ChatGateway] ${this.userId} connected`);
    } else {
      console.log('[ChatGateway] User not found. Disconnecting...');
      client.disconnect();
    }
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
