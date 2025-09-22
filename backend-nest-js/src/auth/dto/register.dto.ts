import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string; // plain password, we’ll hash it

  @IsNotEmpty()
  role: string; // e.g. "admin" | "manager" | "member"
}
