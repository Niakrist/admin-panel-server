import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  avatarUrl: string;

  @IsString()
  country: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;
}

export type UpdateUserDto = Partial<CreateUserDto>;
