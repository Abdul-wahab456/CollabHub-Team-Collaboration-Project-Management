import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get(':id/overview')
  async getOverview(@Param('id') id: string) {
    const userId = parseInt(id, 10); // convert string → number
    return this.userService.getOverview(userId);
  }
  // user.controller.ts

  @Get(':id/projects')
  async getUserProjects(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return this.userService.getUserProjects(userId);
  }
}
