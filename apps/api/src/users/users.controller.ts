import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Delete } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. SIGN UP (POST /users)
  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  // 2. LOG IN (POST /users/login)
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.usersService.login(body.email, body.password);
    
    // If service returns null, user/pass is wrong
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    
    return user;
  }

  // 3. LIST ALL USERS (GET /users)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 6. GET DASHBOARD STATS (GET /users/stats/:id)
  // ** IMPORTANT: This must come BEFORE the ':email' or ':id' routes to avoid conflict
  @Get('stats/:id')
  getStats(@Param('id') id: string) {
    return this.usersService.getDashboardStats(id);
  }

  // 4. FIND ONE USER BY EMAIL (GET /users/:email)
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  // 5. UPDATE PROFILE (PATCH /users/:id)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }
  // PATCH /api/users/password/:id
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() body: any) {
    return this.usersService.changePassword(id, body.password);
  }

  // DELETE /api/users/:id
  @Delete(':id') // Add 'Delete' to imports from @nestjs/common
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}