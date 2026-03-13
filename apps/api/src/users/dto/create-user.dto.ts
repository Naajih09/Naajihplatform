import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNotEmpty } from 'class-validator'; // Added IsOptional and IsNotEmpty
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' }) 
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' }) 
  lastName: string;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  organization?: string;
}