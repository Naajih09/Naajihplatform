// apps/api/src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  Headers,
  UnauthorizedException,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // 1. SIGN UP (Public endpoint, no guards)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Use DTO for validation
    if (createUserDto.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Admin accounts cannot be created via signup.',
      );
    }
    return this.usersService.create(createUserDto);
  }

  // 2. LOG IN (Public endpoint, no guards)
  @Post('login')
  async login(@Body() body: any) {
    // Consider creating a LoginUserDto for email/password
    return this.authService.login(body.email, body.password);
  }

  // 2b. ADMIN CREATE (Internal use only, protected by shared secret)
  @Post('admin/seed')
  async createAdmin(
    @Body() body: AdminCreateUserDto,
    @Headers('x-admin-seed-secret') seedSecret?: string,
  ) {
    const expected = process.env.ADMIN_SEED_SECRET;
    if (!expected) {
      throw new UnauthorizedException('Admin seed secret is not configured.');
    }
    if (seedSecret !== expected) {
      throw new UnauthorizedException('Invalid admin seed secret.');
    }

    return this.usersService.createAdmin(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  // 3. GET DASHBOARD STATS (User can view their own, Admin can view any)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Get('stats/:id')
  getStats(@Param('id') id: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('You can only view your own stats.');
    }
    return this.usersService.getDashboardStats(id);
  }

  // 3b. ADMIN PLATFORM STATS
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  getAdminStats() {
    return this.usersService.getAdminStats();
  }

  // 3c. ADMIN INSIGHTS (Time series)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/insights')
  getAdminInsights() {
    return this.usersService.getAdminInsights();
  }

  // 4. FIND ALL (Protected: Only ADMIN can view all users)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.usersService.findAll({ search, role, sortBy, page, pageSize });
  }

  // 5b. REQUEST EMAIL VERIFICATION (Authenticated)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Post('verify-email/request')
  requestVerification(@Request() req) {
    return this.usersService.requestEmailVerification(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Post('subscription/trial')
  startTrial(@Request() req) {
    return this.usersService.startTrial(req.user.id);
  }

  // 5c. VERIFY EMAIL TOKEN (Public)
  @Get('verify-email')
  verifyEmail(@Query('token') token?: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    return this.usersService.verifyEmailToken(token);
  }

  // 5. FIND ONE (Protected: User can view their own, Admin can view any)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Get(':email')
  findOne(@Param('email') email: string, @Request() _req) {
    // Optional: Add logic to allow user to only fetch their own profile
    // if (req.user.role !== UserRole.ADMIN && req.user.email !== email) {
    //   throw new ForbiddenException('You can only view your own profile.');
    // }
    return this.usersService.findOne(email);
  }

  // 6. UPDATE PROFILE (Protected: User can update their own, Admin can update any)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() _req) {
    // Optional: Add logic to allow user to only update their own profile
    // if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
    //   throw new ForbiddenException('You can only update your own profile.');
    // }
    if (
      (body.role || typeof body.isActive === 'boolean') &&
      _req.user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Only admins can change role or active status.',
      );
    }
    return this.usersService.update(id, body);
  }

  // 7. CHANGE PASSWORD (Protected: User can change their own)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ADMIN,
  )
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() body: any, @Request() _req) {
    // Optional: Add logic to allow user to only change their own password
    // if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
    //   throw new ForbiddenException('You can only change your own password.');
    // }
    return this.usersService.changePassword(id, body.password);
  }

  // 8. DELETE ACCOUNT (Protected: Only ADMIN can delete accounts)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
