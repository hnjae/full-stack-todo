import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UserMatchGuard } from './user-match.guard';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: remove or guard this in production <2025-02-05>
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // TODO: delete this endpoint in production <2025-03-23>
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

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Get user data' })
  async get(@Param('userId') id: string) {
    const user = await this.usersService.get(id);
    if (user == null) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user data' })
  async update(
    @Param('userId') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
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

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('userId') id: string) {
    try {
      const user = await this.usersService.delete(id);
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
