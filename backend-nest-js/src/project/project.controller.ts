import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from 'src/auth/guards/roles.decorator';
// import { Role } from 'src/auth/guards/roles.enum';

@Controller(':id/projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async create(@Body() dto: CreateProjectDto, @Param('id') id: string) {
    const userId = parseInt(id, 10); // convert string → number
    return this.projectService.create(dto, userId);
  }

  @Get()
  async findAll(@Param('id') id: string) {
    const userId = parseInt(id, 10); // convert string → number
    return this.projectService.findUserProjects(userId);
  }

  @Patch('update/:projectId') // use PATCH for partial updates
  async update(
    @Param('projectId') projectId: number,
    @Body() data: UpdateProjectDto,
    @Param('id') id: string,
  ) {
    const userId = parseInt(id, 10); // convert string → number
    return this.projectService.update(projectId, data, userId);
  }

  @Delete('delete/:projectId') // use DELETE for deletions
  async remove(@Param('projectId') projectId: number, @Param('id') id: string) {
    const userId = parseInt(id, 10); // convert string → number
    return this.projectService.remove(projectId, userId);
  }

  @Post('add-member')
  async addMember(@Body() body: { projectId: number; email: string }) {
    return this.projectService.addMember(body.projectId, body.email);
  }
  @Get(':id/members')
  async getProjectMembers(@Param('id') id: string) {
    const projectId = parseInt(id, 10);
    return this.projectService.getProjectMembers(projectId);
  }
  @Get('/members')
  getUserMembers() {
    return this.projectService.getUserMembers();
  }
}
