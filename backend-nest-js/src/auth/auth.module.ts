import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    // Tells how to validate & decode JWTs tokens
    JwtModule.register({ 
      secret: process.env.JWT_SECRET,
    }),
    DatabaseModule,
    PassportModule.register({ session: false }),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy,UserService],
  controllers: [AuthController],
})
export class AuthModule {
  // middleware apply for specific routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/login', 'auth/signup'); // apply only to login & signup routes
  }
}
