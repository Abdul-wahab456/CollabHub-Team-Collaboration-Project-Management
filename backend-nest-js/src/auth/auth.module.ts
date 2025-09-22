import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
       // secret for signing tokens
    }),
    DatabaseModule,
    PassportModule.register({ session: false }),
  ],
  providers: [AuthService, GoogleStrategy,],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/login', 'auth/signup'); // apply only to login & signup routes
  }
}
