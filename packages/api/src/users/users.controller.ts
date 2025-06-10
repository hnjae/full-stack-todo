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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UserMatchGuard } from './user-match.guard';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user data' })
  async get(@Param('userId') id: string) {
    const user = await this.usersService.get(id);
    if (user == null) {
      throw new HttpException('User does not exists', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @ApiBearerAuth()
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

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @ApiBearerAuth()
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
