import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserMatchGuard } from 'src/users/user-match.guard';

import {
  BatchUpdateTodoListDto,
  CreateTodoListDto,
  TodoListDto,
  UpdateTodoListDto,
} from './todo-lists.dto';
import { TodoListsService } from './todo-lists.service';

@Controller('users/:userId/todo-lists')
@UseGuards(JwtAuthGuard, UserMatchGuard)
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todo-lists.' })
  async getAll(@Param('userId') userId: string): Promise<TodoListDto[]> {
    return this.todoListsService.getAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a todo list.' })
  async create(
    @Param('userId') userId: string,
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoListDto> {
    try {
      const todoList = await this.todoListsService.create(
        userId,
        createTodoListDto,
      );
      return todoList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // catch something if required
      }

      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Patch a batch of todo list items. (atomic)' })
  async batchUpdate(
    @Body(
      new ParseArrayPipe({
        // NOTE: `useGlobalPipes` 에 적용한 값이 여기에는 적용되지 않아 별도로 설정 해야 한다.
        items: BatchUpdateTodoListDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateItems: BatchUpdateTodoListDto[],
  ) {
    try {
      return await this.todoListsService.batchUpdate(updateItems);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // catch something if required
      }

      throw error;
    }
  }

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
