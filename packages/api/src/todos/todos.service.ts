import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTodoDto, TodoDto, UpdateTodoDto } from './todos.dto';

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

  async delete(todoId: string): Promise<TodoDto> {
    const todo = await this.prismaService.todo.delete({
      where: { id: todoId },
    });

    return todo;
  }
}
