import { Controller, Post, Body, UsePipes, Get, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from "express";
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginValidationPipe } from './pipes/login-validation.pipe';
import { RegisterDto } from './dto/register.dto';
import { SignupValidationPipe } from './pipes/signup-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './guards/roles.decorator';
import { Role } from './guards/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(LoginValidationPipe)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Get()
  @Roles(Role.Admin, Role.ProjectManager)
  findAll() {
    return 'Only Admins and Project Managers can see this';
  }
  @Post('signup')
  @UsePipes(SignupValidationPipe)
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }
  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req,@Res() res: Response) {
      const user = req.user; // comes from GoogleStrategy.validate
      const tokens = await this.authService.getTokens(user.id, user.email);
      await this.authService.updateRefreshToken(user.id, tokens.refresh_token);
    // return {
    //   message: 'User information from Google',
    //   user: req.user,
    // };
    return res.redirect(
  `http://localhost:3000/dashboard?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`
);

  }
}
