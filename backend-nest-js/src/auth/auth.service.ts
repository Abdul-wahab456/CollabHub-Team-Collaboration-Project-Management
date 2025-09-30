import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // use for compare hashed password
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
// import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: PrismaService,
    // private userService: UserService,
  ) {}
  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });

    // If user not found, throw error
    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }
    // Check if user is a Google OAuth user (no password)
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Please use Google Sign-In for this account',
      );
    }
    // Compare hashed password with input dto password is input from user and user.password is from database
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Ivalid Email or Password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
        userId: user.id,
        ...tokens,

    }
  }
  async signup(dto: RegisterDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      // If user exists and has no password (Google user), allow setting password
      if (!existingUser.passwordHash) {
        throw new ConflictException(
          'Email already registered with Google. Please use Google Sign-In.',
        );
      }
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Save user
    const user = await this.databaseService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role || 'Team Member', // default role"",
      },
    });

    console.log('User created:', user);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return {
        userId: user.id,
        ...tokens,

    }
  }

  // It will generate both access and refresh tokens
  async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h', // short-lived
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '2d', // long-lived
      }),
    ]);

    return { access_token, refresh_token };
  }
  // It will hash the refresh token and store it in the database
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefresh },
    });
  }
  // this method will verify the refresh token and issue new tokens
  async refreshTokens(userId: number, refreshToken: string) {
    // User exists in Database
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    // Refresh token matches
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    // Check if refresh token is expired
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }
}
