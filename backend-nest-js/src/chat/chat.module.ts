// import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
// import { ChatService } from './chat.service';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'dev-secret',
//       signOptions: { expiresIn: '7d' },
//     }),
//   ],
//   providers: [ChatGateway, ChatService],
//   exports: [ChatService],
// })
// export class ChatModule {}
