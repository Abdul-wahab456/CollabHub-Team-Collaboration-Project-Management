// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class ChatService {
//   constructor(private prisma = new PrismaClient()) {}

//   async saveMessage(userId: number, projectId: number, content: string) {
//     return this.prisma.message.create({
//       data: {
//         content,
//         senderId: userId,
//         projectId,
//       },
//       include: { sender: { select: { id: true, name: true, avatar: true } } },
//     });
//   }

//   async markAsRead(userId: number, messageId: number) {
//     // Example placeholder. Add read receipts table if you need per-user reads.
//     return { ok: true };
//   }

//   async getRecentMessages(projectId: number, limit = 50) {
//     return this.prisma.message.findMany({
//       where: { projectId },
//       orderBy: { createdAt: 'asc' },
//       take: limit,
//       include: { sender: { select: { id: true, name: true, avatar: true } } },
//     });
//   }
// }
