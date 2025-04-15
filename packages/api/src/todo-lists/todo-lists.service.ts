import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  BatchUpdateTodoListDto,
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

  async batchUpdate(
    updateItems: BatchUpdateTodoListDto[],
  ): Promise<TodoListDto[]> {
    if (updateItems.length === 0) {
      return [];
    }

    const counts = await this.prismaService.todoList.count({
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
      this.prismaService.todoList.update({
        where: { id: item.id },
        data: item.payload,
      }),
    );

    return this.prismaService.$transaction(updateOperations);
  }

  async delete(todoListId: string): Promise<TodoListDto> {
    const todo = await this.prismaService.todoList.delete({
      where: { id: todoListId },
    });

    return todo;
  }
}
