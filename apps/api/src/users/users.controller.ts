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
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Admin accounts cannot be created via signup.',
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.usersService.requestPasswordReset(body.email);
  }

  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.usersService.resetPassword(body.token, body.password);
  }

  @Throttle({ short: { limit: 2, ttl: 60000 } })
  @Post('admin/seed')
  async createAdmin(
    @Body() body: AdminCreateUserDto,
    @Headers('x-admin-seed-secret') seedSecret?: string,
  ) {
    if (process.env.ALLOW_ADMIN_SEED !== 'true') {
      throw new ForbiddenException(
        'Admin seed endpoint is disabled unless explicitly enabled.',
      );
    }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/dashboard')
  getAdminDashboard() {
    return this.usersService.getAdminDashboard();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  getAdminStats() {
    return this.usersService.getAdminStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/insights')
  getAdminInsights() {
    return this.usersService.getAdminInsights();
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/team')
  getAdminTeam() {
    return this.usersService.getAdminTeam();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/team')
  createAdminTeamMember(@Body() body: any) {
    return this.usersService.createAdminTeamMember(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/team/:id/permissions')
  updateAdminPermissions(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateAdminPermissions(id, body?.adminPermissions);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/team/:id/password')
  updateAdminPassword(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateAdminPassword(id, body?.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Post('verify-email/request')
  requestVerification(@Request() req) {
    return this.usersService.requestEmailVerification(req.user.id);
  }

  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @Post('verify-email/resend')
  resendVerification(@Body() body: { email?: string }) {
    if (!body?.email) {
      throw new BadRequestException('Email is required');
    }
    return this.usersService.requestEmailVerificationByEmail(body.email);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Get('me/entitlements')
  getEntitlements(@Request() req) {
    return this.usersService.getEntitlements(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Get('me/onboarding')
  getOnboarding(@Request() req) {
    return this.usersService.getOnboarding(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Patch('me/onboarding/:stepKey')
  updateOnboardingStep(
    @Param('stepKey') stepKey: string,
    @Body() body: { completed?: boolean },
    @Request() req,
  ) {
    return this.usersService.markOnboardingStep(
      req.user.id,
      stepKey,
      body?.completed !== false,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Post('me/onboarding/dismiss')
  dismissOnboarding(@Request() req) {
    return this.usersService.dismissOnboarding(req.user.id);
  }

  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @Get('verify-email')
  verifyEmail(@Query('token') token?: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    return this.usersService.verifyEmailToken(token);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Get(':email')
  findOne(@Param('email') email: string, @Request() _req) {
    if (_req.user.role !== UserRole.ADMIN && _req.user.email !== email) {
      throw new ForbiddenException('You can only view your own profile.');
    }
    return this.usersService.findPublicByEmail(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMIN,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() _req) {
    if (_req.user.role !== UserRole.ADMIN && _req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ADMIN,
  )
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() body: any, @Request() _req) {
    if (_req.user.role !== UserRole.ADMIN && _req.user.id !== id) {
      throw new ForbiddenException('You can only change your own password.');
    }
    return this.usersService.changePassword(id, body.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
