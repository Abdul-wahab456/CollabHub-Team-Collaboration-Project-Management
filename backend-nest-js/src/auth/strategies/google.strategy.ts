import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private databaseService: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      prompt: 'select_account',
      accessType: 'offline',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    // Your existing validate logic
    const { name, emails, photos } = profile;
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
        passwordHash: 'undefined',
        avatar: photos[0].value,
      },
    });
    done(null, user_database);
  }
}