import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserMatchGuard } from 'src/users/user-match.guard';

import {
  CreateTodoListDto,
  TodoListDto,
  UpdateTodoListDto,
} from './todo-lists.dto';
import { TodoListsService } from './todo-lists.service';

@Controller('users/:userId/todo-lists')
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Get()
  @ApiOperation({ summary: 'Get all todo-lists.' })
  async getAll(@Param('userId') userId: string): Promise<TodoListDto[]> {
    return this.todoListsService.getAll(userId);
  }

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Post()
  @ApiOperation({ summary: 'Create a todo list.' })
  async create(
    @Param('userId') userId: string,
    @Body() craeteTodoListDto: CreateTodoListDto,
  ): Promise<TodoListDto> {
    try {
      const todoList = await this.todoListsService.create(
        userId,
        craeteTodoListDto,
      );
      return todoList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // catch something if required
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a todo list.' })
  async get(@Param('id') todoListId: string): Promise<TodoListDto> {
    try {
      const todoList = await this.todoListsService.get(todoListId);
      return todoList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo list does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo list.' })
  async update(
    @Param('id') todoListId: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ): Promise<TodoListDto> {
    try {
      const todoList = await this.todoListsService.update(
        todoListId,
        updateTodoListDto,
      );
      return todoList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo list does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, UserMatchGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo.' })
  async delete(@Param('id') todoListId: string): Promise<TodoListDto> {
    try {
      const todo = await this.todoListsService.delete(todoListId);
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo list does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw error;
    }
  }
}
