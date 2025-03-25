import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { TodoListsController } from './todo-lists.controller';
import { TodoListsService } from './todo-lists.service';

@Module({
  controllers: [TodoListsController],
  providers: [PrismaService, TodoListsService],
})
export class TodoListsModule {}
