import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { dueDate, ...rest } = createTaskDto;

    return this.prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(projectId?: number) {
    const where = projectId ? { projectId } : {};
    // Filter apply the Project Id is exists on Project table or not.

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: {   // this is foregin key of user to get the user information
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {    // this is get the project information from project table 
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return task;
  }

  async remove(id: number) {
    await this.findOne(id); // Check if task exists

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async findByProject(projectId: number) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
async statusupdate(id: number, newStatus: string) {
  return this.prisma.task.update({
    where: { id },
    data: { status: newStatus }
  });
}
}