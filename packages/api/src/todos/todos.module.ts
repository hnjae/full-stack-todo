import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserMatchGuard } from 'src/users/user-match.guard';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  providers: [TodosService, PrismaService, UserMatchGuard, JwtAuthGuard],
  controllers: [TodosController],
})
export class TodosModule {}
