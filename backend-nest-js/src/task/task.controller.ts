import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    const id = projectId ? parseInt(projectId, 10) : undefined;
    return this.taskService.findAll(id);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.taskService.findByProject(parseInt(projectId, 10));
  }
@Patch("update/:id")
statusupdate(
  @Param('id') id: string,
  @Body() body: { status: string }
) {
  return this.taskService.statusupdate(parseInt(id, 10), body.status);
}
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(parseInt(id, 10));
  // }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(parseInt(id, 10));
  }
}