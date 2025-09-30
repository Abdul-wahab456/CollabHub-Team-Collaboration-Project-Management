import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class SignupValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('No data provided');
    }

    let { name, email, password, role } = value;
    if (!role) {
      role = 'Team Member';
    }
    // Trim whitespace
    name = typeof name === 'string' ? name.trim() : name;
    email = typeof email === 'string' ? email.trim().toLowerCase() : email;

    // Name validation
    if (!name || typeof name !== 'string') {
      throw new BadRequestException('Name is required');
    }

    // Email validation
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Password validation
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // Role validation
    const allowedRoles = ['Project Manager', 'Team Member'];
    if (!role || !allowedRoles.includes(role)) {
      throw new BadRequestException(
        `Role must be one of: ${allowedRoles.join(', ')}`,
      );
    }

    return {
      ...value,
      name,
      email,
    } as RegisterDto;
  }
}
