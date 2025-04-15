import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  BatchUpdateTodoDto,
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from './todos.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: string): Promise<TodoDto[]> {
    const todos = await this.prismaService.todo.findMany({
      where: { userId: userId },
    });

    return todos;
  }

  async create(userId: string, createTodoDto: CreateTodoDto): Promise<TodoDto> {
    const todo = await this.prismaService.todo.create({
      data: {
        ...createTodoDto,
        userId: userId,
      },
    });

    return todo;
  }

  async get(todoId: string): Promise<TodoDto> {
    const todo = await this.prismaService.todo.findUniqueOrThrow({
      where: { id: todoId },
    });

    return todo;
  }

  async update(todoId: string, updateTodoDto: UpdateTodoDto): Promise<TodoDto> {
    const todo = await this.prismaService.todo.update({
      where: { id: todoId },
      data: updateTodoDto,
    });

    return todo;
  }

  async batchUpdate(updateItems: BatchUpdateTodoDto[]): Promise<TodoDto[]> {
    if (updateItems.length === 0) {
      return [];
    }

    const counts = await this.prismaService.todo.count({
      where: {
        id: {
          in: updateItems.map((item) => item.id),
        },
      },
    });

    if (counts !== updateItems.length) {
      throw new NotFoundException('Not all items found');
    }

    const updateOperations = updateItems.map((item) =>
      this.prismaService.todo.update({
        where: { id: item.id },
        data: item.payload,
      }),
    );

    return this.prismaService.$transaction(updateOperations);
  }

  async delete(todoId: string): Promise<TodoDto> {
    const todo = await this.prismaService.todo.delete({
      where: { id: todoId },
    });

    return todo;
  }
}
