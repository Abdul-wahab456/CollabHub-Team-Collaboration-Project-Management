// user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async getOverview(userId: number) {
  // run all queries in parallel
  const [
    TeamMembers,
    ProjectManager,
    InProgress,
    Completed,
    ToDo,
  ] = await Promise.all([
    this.prisma.user.count({ where: { role: 'TeamMember' } }),
    this.prisma.user.count({ where: { role: 'ProjectManager' } }),
    this.prisma.task.count({ where: { status: 'InProgress', assigneeId: userId } }),
    this.prisma.task.count({ where: { status: 'Completed', assigneeId: userId } }),
    this.prisma.task.count({ where: { status: 'ToDo', assigneeId: userId } }),
  ]);

  return {
    kpis: {
      TeamMembers,
      ProjectManager,
      InProgress,
      Completed,
      ToDo,
    },
  };
}
// user.service.ts

async getUserProjects(userId: number) {
  return this.prisma.project.findMany({
    where: {
      members: {
        some: {
          id: userId
        }
      }
    },
    select: {
      id: true,
      name: true,
      description: true,
    }
  });
}
async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
