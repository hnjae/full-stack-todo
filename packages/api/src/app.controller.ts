import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO: remove this in production <2025-01-22>
  @UseGuards(JwtAuthGuard)
  @Get('auth-demo')
  jwtAuthDemo(@Req() request: Request) {
    // request.user 에 JwtAuthGuard 가 vallidate() 에서 반환한 값이 들어있음.
    console.log(request);
    return this.appService.getHello();
  }
}
