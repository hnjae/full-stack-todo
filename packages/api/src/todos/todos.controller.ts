// TODO: guard theses api <2025-03-19>
// @UseGuards(JwtAuthGuard, UserMatchGuard)
// TODO:  없는 userId 에 CRUD할려고한다면??? 대응이 되어 있나? 가드에서 막을 것 같긴하다. <2025-03-19>

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

import { CreateTodoDto, TodoDto, UpdateTodoDto } from './todos.dto';
import { TodosService } from './todos.service';

@Controller('users/:userId/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos.' })
  async getAll(@Param('userId') userId: string): Promise<TodoDto[]> {
    return this.todosService.getAll(userId);
  }

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

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo.' })
  async get(@Param('id') todoId: string): Promise<TodoDto> {
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

  @Put(':id')
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
