// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ChatService } from './chat.service';
// import { JwtService } from '@nestjs/jwt';
// import { Injectable, Logger } from '@nestjs/common';

// type AuthPayload = { sub: number; email?: string; name?: string };

// @WebSocketGateway({
//   cors: { origin: '*' },
//   namespace: '/chat',
// })
// @Injectable()
// export class ChatGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   private server: Server;
//   private readonly logger = new Logger('ChatGateway');

//   // in-memory maps
//   private online = new Map<number, Set<string>>(); // userId -> set(socketId)
//   private socketUser = new Map<string, number>(); // socketId -> userId

//   constructor(private chatService: ChatService, private jwt: JwtService) {}

//   afterInit(server: Server) {
//     this.server = server;
//     // optional: set adapter to Redis for scaling -- see comment below
//   }

//   async handleConnection(client: Socket) {
//     try {
//       const token = client.handshake.auth?.token;
//       if (!token) throw new Error('No token');

//       const payload = this.jwt.verify<AuthPayload>(token);
//       const userId = payload.sub;
//       if (!userId) throw new Error('Invalid token payload');

//       this.socketUser.set(client.id, userId);
//       if (!this.online.has(userId)) this.online.set(userId, new Set());
//       this.online.get(userId)!.add(client.id);

//       // broadcast online status
//       this.server.emit('user:online', { userId });

//       client.emit('connected', { userId });

//       this.logger.log(`User ${userId} connected (${client.id})`);
//     } catch (err) {
//       this.logger.warn('Socket auth failed: ' + (err as Error).message);
//       client.disconnect();
//     }
//   }

//   handleDisconnect(client: Socket) {
//     const userId = this.socketUser.get(client.id);
//     if (userId) {
//       const sockets = this.online.get(userId);
//       sockets?.delete(client.id);
//       if (!sockets || sockets.size === 0) {
//         this.online.delete(userId);
//         this.server.emit('user:offline', { userId });
//       }
//       this.socketUser.delete(client.id);
//       this.logger.log(`User ${userId} disconnected (${client.id})`);
//     }
//   }

//   // Join a project room
//   @SubscribeMessage('join')
//   async handleJoin(
//     @MessageBody() data: { projectId: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { projectId } = data;
//     client.join(this.roomName(projectId));
//     const messages = await this.chatService.getRecentMessages(projectId);
//     client.emit('history', messages);
//   }

//   @SubscribeMessage('leave')
//   handleLeave(
//     @MessageBody() data: { projectId: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     client.leave(this.roomName(data.projectId));
//   }

//   @SubscribeMessage('message')
//   async handleMessage(
//     @MessageBody() data: { content: string; projectId: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const userId = this.socketUser.get(client.id);
//     if (!userId) return;

//     // save to DB
//     const saved = await this.chatService.saveMessage(
//       userId,
//       data.projectId,
//       data.content,
//     );

//     // broadcast to room
//     this.server
//       .to(this.roomName(data.projectId))
//       .emit('message', { ...saved });

//     return { status: 'ok' };
//   }

//   @SubscribeMessage('typing')
//   handleTyping(
//     @MessageBody() data: { projectId: number; typing: boolean },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const userId = this.socketUser.get(client.id);
//     if (!userId) return;
//     client
//       .to(this.roomName(data.projectId))
//       .emit('typing', { userId, typing: data.typing });
//   }

//   @SubscribeMessage('read')
//   async handleRead(
//     @MessageBody() data: { messageId: number; projectId: number },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const userId = this.socketUser.get(client.id);
//     if (!userId) return;
//     await this.chatService.markAsRead(userId, data.messageId);
//     this.server
//       .to(this.roomName(data.projectId))
//       .emit('read', { userId, messageId: data.messageId });
//   }

//   private roomName(projectId: number) {
//     return `project_${projectId}`;
//   }
// }
