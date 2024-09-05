import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  async findAll() {
    return this.usersService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user data' })
  async get(@Param('email') email: string) {
    return this.usersService.get(email);
  }

  @Put(':email')
  @ApiOperation({ summary: 'Update user data' })
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('email') email: string) {
    return this.usersService.delete(email);
  }
}
