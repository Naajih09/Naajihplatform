// apps/api/src/users/users.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';     
import { Roles } from '../auth/decorators/roles.decorator';   
import { UserRole } from '@prisma/client';                    
import { CreateUserDto } from './dto/create-user.dto';        

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  // 1. SIGN UP (Public endpoint, no guards)
  @Post()
  create(@Body() createUserDto: CreateUserDto) { // Use DTO for validation
    return this.usersService.create(createUserDto);
  }

  // 2. LOG IN (Public endpoint, no guards)
  @Post('login')
  async login(@Body() body: any) { // Consider creating a LoginUserDto for email/password
    return this.authService.login(body.email, body.password);
  }

  // 3. GET DASHBOARD STATS (Protected: Only ADMIN can view stats)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats/:id')
  getStats(@Param('id') id: string) {
    return this.usersService.getDashboardStats(id);
  }

  // 4. FIND ALL (Protected: Only ADMIN can view all users)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 5. FIND ONE (Protected: User can view their own, Admin can view any)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ENTREPRENEUR, UserRole.INVESTOR, UserRole.ASPIRING_BUSINESS_OWNER)
  @Get(':email')
  findOne(@Param('email') email: string, @Request() req) {
    // Optional: Add logic to allow user to only fetch their own profile
    // if (req.user.role !== UserRole.ADMIN && req.user.email !== email) {
    //   throw new ForbiddenException('You can only view your own profile.');
    // }
    return this.usersService.findOne(email);
  }

  // 6. UPDATE PROFILE (Protected: User can update their own, Admin can update any)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ENTREPRENEUR, UserRole.INVESTOR, UserRole.ASPIRING_BUSINESS_OWNER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    // Optional: Add logic to allow user to only update their own profile
    // if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
    //   throw new ForbiddenException('You can only update your own profile.');
    // }
    return this.usersService.update(id, body);
  }

  // 7. CHANGE PASSWORD (Protected: User can change their own)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR, UserRole.ASPIRING_BUSINESS_OWNER, UserRole.ADMIN)
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() body: any, @Request() req) {
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