import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

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
    try {
      const user = await this.usersService.create(createUserDto);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          // "Unique constraint failed on the {constraint}"
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
      }

      throw error;
    }
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user data' })
  async get(@Param('email') email: string) {
    const user = await this.usersService.get(email);
    if (user == null) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':email')
  @ApiOperation({ summary: 'Update user data' })
  async update(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(email, updateUserDto);
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          // Record to update not found.
          throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
        } else if (error.code == 'P2002') {
          // Unique constraint failed on the fields:
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
      }

      throw error;
    }
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('email') email: string) {
    try {
      const user = await this.usersService.delete(email);
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          // Record to delete does not exist.
          throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
        }
      }
      throw error;
    }
  }
}
