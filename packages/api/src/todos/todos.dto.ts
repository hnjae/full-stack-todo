import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class TodoDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string | null;

  @ApiProperty()
  @IsBoolean()
  completed: boolean;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  dueDate: Date | null;

  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  todoListId: string;
}

export class CreateTodoDto extends OmitType(TodoDto, [
  'id',
  'createdAt',
  'updatedAt',
  'userId',
] as const) {}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
