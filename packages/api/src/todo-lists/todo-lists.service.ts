import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateTodoListDto,
  TodoListDto,
  UpdateTodoListDto,
} from './todo-lists.dto';

@Injectable()
export class TodoListsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string): Promise<TodoListDto[]> {
    const todoLists = await this.prismaService.todoList.findMany({
      where: { userId: userId },
    });

    return todoLists;
  }

  async create(
    userId: string,
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoListDto> {
    const todo = await this.prismaService.todoList.create({
      data: {
        ...createTodoListDto,
        userId: userId,
      },
    });

    return todo;
  }

  async get(todoListId: string): Promise<TodoListDto> {
    const todo = await this.prismaService.todoList.findUniqueOrThrow({
      where: { id: todoListId },
    });

    return todo;
  }

  async update(
    todoListId: string,
    updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoListDto> {
    const todo = await this.prismaService.todoList.update({
      where: { id: todoListId },
      data: updateTodoListDto,
    });

    return todo;
  }

  async delete(todoListId: string): Promise<TodoListDto> {
    const todo = await this.prismaService.todoList.delete({
      where: { id: todoListId },
    });

    return todo;
  }
}
