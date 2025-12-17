import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

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

  // 4. FIND ONE USER BY EMAIL (GET /users/:email)
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  // 5. UPDATE PROFILE (PATCH /users/:id)
  // This is the new part for the Profile Page!
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }
}