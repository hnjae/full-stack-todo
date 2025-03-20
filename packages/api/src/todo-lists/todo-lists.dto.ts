import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class TodoListDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class CreateTodoListDto extends OmitType(TodoListDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {}
