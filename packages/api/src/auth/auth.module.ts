import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      // NOTE: `global` means that we don't need to import the JwtModule anywhere else in our application.
      global: true,
      // NOTE: 환경변수를 검증하고 사용하기 위해  process.env.JWT_SECRET 에서 읽어 들이지 않음.
      secret: new ConfigService().get('JWT_SECRET'),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
