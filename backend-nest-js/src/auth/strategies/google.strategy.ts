import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service'; // Import your AuthService


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // getTokens: any;
  constructor(
      private databaseService: PrismaService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,      // from Google Cloud Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g. http://localhost:3000/auth/google/redirect
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user_console = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    const user_database = await this.databaseService.user.upsert({
    where: { email: emails[0].value },
    update: {
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos[0].value,
    },
    create: {
      name: `${name.givenName} ${name.familyName}`,
      email: emails[0].value,
      role: 'Team Member',
      passwordHash: "undefined", // null for Google OAuth users
      avatar: photos[0].value,
    },
  });
    done(null, user_database);
  }
}
