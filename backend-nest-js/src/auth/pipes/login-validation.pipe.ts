import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  transform(value: any) {
    // Check that value exists
    if (!value) {
      throw new BadRequestException('No data provided');
    }
    const { email, password } = value;
    // Check email
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email must be a string');
    }

    // Simple regex check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    // Check password
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password must be a string');
    }
    
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Return validated object
    return value as LoginDto;
  }
}
