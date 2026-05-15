import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const websocketCorsOrigin =
  process.env.NODE_ENV === 'production'
    ? (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : '*';

@WebSocketGateway({
  cors: {
    origin: websocketCorsOrigin,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Notification Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Notification Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('join_notifications')
  handleJoinNotifications(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`notifications_${data.userId}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`User ${data.userId} joined notification room`);
    }
  }

  sendNotification(userId: string, notification: any) {
    this.server
      .to(`notifications_${userId}`)
      .emit('notification_received', notification);
  }
}
