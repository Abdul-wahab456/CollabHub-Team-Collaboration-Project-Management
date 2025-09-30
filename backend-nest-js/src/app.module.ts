import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module';
// import { ProjectModule } from './project/project.module';
// import { TaskModule } from './task/task.module';
// import { ChatModule } from './chat/chat.module';
// import { FileModule } from './file/file.module';
import { DatabaseModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
// import { CommonModule } from './common/common.module';
// import { UsersController } from './users/users.controller';
// import { UsersService } from './users/users.service';

// @Module({
//   imports: [AuthModule, UserModule, ProjectModule, TaskModule, ChatModule, FileModule, DatabaseModule, CommonModule],
//   controllers: [AppController, UsersController],
//   providers: [AppService, UsersService],
// })
@Module({
  imports: [AuthModule, DatabaseModule,UserModule,FileModule, ProjectModule,TaskModule],

  providers: [
    {
          provide: APP_GUARD,
          useClass: RolesGuard,
    },],
})
export default class AppModule {}
