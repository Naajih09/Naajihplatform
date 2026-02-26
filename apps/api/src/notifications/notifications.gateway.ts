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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Notification Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Notification Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_notifications')
  handleJoinNotifications(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`notifications_${data.userId}`);
    console.log(`User ${data.userId} joined notification room`);
  }

  sendNotification(userId: string, notification: any) {
    this.server.to(`notifications_${userId}`).emit('notification_received', notification);
  }
}
