import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsIn,
} from 'class-validator'; // Added IsOptional and IsNotEmpty
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(UserRole)
  @IsIn(
    [
      UserRole.ENTREPRENEUR,
      UserRole.INVESTOR,
      UserRole.ASPIRING_BUSINESS_OWNER,
    ],
    { message: 'Admin accounts cannot be created via signup.' },
  )
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
