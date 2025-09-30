import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findUserProjects(userId: number) {    //findmany get multiple rows
    const projects = await this.prisma.project.findMany({
      where: {
        members: {
          some: { id: userId },  // some is join 
        },
      },
      // include is use the project user id and user table user id match extract only that user information
      include: { 
        creator: { select: { name: true } }, // create is foreign key 
        members: { select: { id: true, name: true, email: true } },
      },
    });
    return projects;
  }

  async create(dto: { name: string; description?: string }, userId: number) {
    const project = await this.prisma.project.create({
      data: {
        // this porotation also work in entity
        name: dto.name,
        description: dto.description,
        createdBy: userId,
        members: {
          connect: { id: userId }, // Add creator as member
        },
      },
    });
    return project;
  }

  // Service
  async update(
    projectId: number,
    data: { name?: string; description?: string },
    userId: number,
  ) {
    // Check if user is the creator
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { createdBy: true, name: true },
    });
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new Error('Only project creator can update the project');
    }
    const update = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return update;
  }

  async remove(projectId: number, userId: number) {
    // Check if user is the creator
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { createdBy: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.createdBy !== userId) {
      throw new Error('Only project creator can delete the project');
    }

    const deletedProject = await this.prisma.project.delete({
      where: { id: projectId },
    });
    return deletedProject;
  }

  async addMember(projectId: number, email: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User with this email does not exist');
    }
    // Add member to project
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        members: { connect: { id: user.id } },
      },
      include: { members: true },
    });
  }

  async getProjectMembers(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project.members;
  }
async getUserMembers() {
  return this.prisma.user.findMany({
    where: {
      role: "TeamMember"
    },
    select: {
      id:true,
      name: true,
      email: true
    }
  });
}
}
