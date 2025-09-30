import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Basic validation for presence of body in POST requests
    if (!req.body && req.method === 'POST') {
      throw new BadRequestException('Request body is missing');
    }

    // Send new people to signup and existing to login.
    if (req.path.includes('signup')) {
      if (!req.body.name || !req.body.email || !req.body.password) {
        throw new BadRequestException(
          'Signup requires name, email, and password',
        );
      }
    }
    // Send existing users to login
    if (req.path.includes('login')) {
      if (!req.body.email || !req.body.password) {
        throw new BadRequestException('Login requires email and password');
      }
    }
    next();
  }
}
