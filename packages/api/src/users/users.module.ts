import { Module } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TodoListsModule } from 'src/todo-lists/todo-lists.module';

import { UserMatchGuard } from './user-match.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, TodoListsModule],
  providers: [UsersService, UserMatchGuard, JwtAuthGuard],
  controllers: [UsersController],
  exports: [UsersService, UserMatchGuard],
})
export class UsersModule {}
