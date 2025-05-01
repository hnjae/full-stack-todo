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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserMatchGuard } from 'src/users/user-match.guard';

import {
  BatchUpdateTodoDto,
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from './todos.dto';
import { TodosService } from './todos.service';

@Controller('users/:userId/todos')
@UseGuards(JwtAuthGuard, UserMatchGuard)
@ApiBearerAuth()
@ApiParam({ name: 'userId', type: 'string', description: 'User ID' })
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a todo.' })
  async create(
    @Param('userId') userId: string,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<TodoDto> {
    try {
      const todo = await this.todosService.create(userId, createTodoDto);
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2003') {
          throw new HttpException(
            'Foreign key constraint failed.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get sorted todos.' })
  async get(
    @Param('userId') userId: string,
    @Query('todoListId') todoListId?: string,
  ): Promise<TodoDto[]> {
    if (todoListId == null) {
      return this.todosService.getAll(userId);
    }

    const todos = await this.todosService.getTodosByList(todoListId);
    return todos;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo.' })
  async getById(@Param('id') todoId: string): Promise<TodoDto> {
    try {
      const todo = await this.todosService.get(todoId);
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw error;
    }
  }

  @Patch()
  @ApiOperation({ summary: 'Patch a batch of todo items. (atomic)' })
  async batchUpdate(
    @Body(
      new ParseArrayPipe({
        // NOTE: `useGlobalPipes` 에 적용한 값이 여기에는 적용되지 않아 별도로 설정 해야 한다.
        items: BatchUpdateTodoDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    updateItems: BatchUpdateTodoDto[],
  ) {
    try {
      return await this.todosService.batchUpdate(updateItems);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // catch something if required
      }

      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo.' })
  async update(
    @Param('id') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoDto> {
    try {
      const todo = await this.todosService.update(todoId, updateTodoDto);
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }

        if (error.code == 'P2003') {
          throw new HttpException(
            'Foreign key constraint failed.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo.' })
  async delete(@Param('id') todoId: string): Promise<TodoDto> {
    try {
      const todo = await this.todosService.delete(todoId);
      return todo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new HttpException(
            'Todo does not exists.',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw error;
    }
  }
}
