import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Is the request well-formed? (Like: shoes & shirt before entering the restaurant)
    if (!req.body && (req.method === 'POST')) {
      throw new BadRequestException('Request body is missing');
    }

    // Send new people to signup and existing to login.
    if (req.path.includes('signup')) {
      if (!req.body.name || !req.body.email || !req.body.password) {
        throw new BadRequestException('Signup requires name, email, and password');
      }
    }

    if (req.path.includes('login')) {
      if (!req.body.email || !req.body.password) {
        throw new BadRequestException('Login requires email and password');
      }
    }
    // ✅ Let the request through
    next();
  }
}
