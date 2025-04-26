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

  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query?.id as string;
    if (userId) {
      this.clients.set(userId, client);
      console.log(`[ChatGateway] ${userId} connected`);
    } else {
      console.log('[ChatGateway] User not found. Disconnecting...');
      client.disconnect();
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit(event, data);
    }
  }
}
