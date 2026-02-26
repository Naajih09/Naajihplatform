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
import { NotificationsService } from '../notifications/notifications.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.userId);
    console.log(`User ${data.userId} joined room`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { 
      content: string; 
      senderId: string; 
      receiverId: string; 
      type?: string; 
      attachmentUrl?: string;
    },
  ) {
    const message = await this.messagesService.create(data);
    
    // Emit to receiver's room (Socket.io room for real-time chat)
    this.server.to(data.receiverId).emit('receive_message', message);
    
    // Trigger persistent notification
    const sender = await (this.messagesService as any).databaseService.user.findUnique({
      where: { id: data.senderId },
      include: { entrepreneurProfile: true, investorProfile: true }
    });
    const senderName = sender?.entrepreneurProfile?.firstName || sender?.investorProfile?.firstName || 'Someone';
    await this.notificationsService.create(data.receiverId, `New message from ${senderName}: ${data.content.substring(0, 20)}...`);

    // Also emit back to sender (optional, but good for confirmation if they wait for it)
    this.server.to(data.senderId).emit('message_sent', message);

    return message;
  }
}
