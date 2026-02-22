import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service'; // Ensure this import exists

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService 
  ) {}

  // 1. SIGN UP
  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

 // 2. LOG IN
  @Post('login')
  async login(@Body() body: any) {
    // Direct return, no "user" variable assignment
    return this.authService.login(body.email, body.password);
  }

  // 3. GET DASHBOARD STATS
  @Get('stats/:id')
  getStats(@Param('id') id: string) {
    return this.usersService.getDashboardStats(id);
  }

  // 4. FIND ALL
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 5. FIND ONE
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  // 6. UPDATE PROFILE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  // 7. CHANGE PASSWORD
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() body: any) {
    return this.usersService.changePassword(id, body.password);
  }

  // 8. DELETE ACCOUNT Public for Admin Dashboard
  // @UseGuards(JwtAuthGuard) 
  @Delete(':id') 
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}