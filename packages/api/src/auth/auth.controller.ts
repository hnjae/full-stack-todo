import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateUserDto, LoginUserDto } from 'src/users/users.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() userDto: CreateUserDto) {
    try {
      const user = await this.authService.register(userDto);
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  async login(@Body() userDto: LoginUserDto) {
    return this.authService.logIn(userDto);
  }
}
