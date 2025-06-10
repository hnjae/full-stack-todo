import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/users/users.dto';

import { AuthService } from './auth.service';
import { AuthUserId, TokenEndpointGuard } from './token-endpoint-guard';

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
        // "Unique constraint failed on the {constraint}"
        if (error.code == 'P2002' && error.meta?.modelName == 'User') {
          throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
      }

      throw error;
    }
  }

  /*
    e.g.)

     POST /token HTTP/1.1
     Host: server.example.com
     Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
     Content-Type: application/x-www-form-urlencoded

     grant_type=password&username=johndoe&password=A3ddj3w
*/
  @Post('token')
  @UseGuards(TokenEndpointGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'token endpoint' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async getToken(
    @AuthUserId() userId: string, // userId is set by TokenEndpointGuard
  ) {
    return this.authService.generateTokenResponse(userId);
  }
}
