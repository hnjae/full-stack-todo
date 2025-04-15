import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
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

export class BatchUpdateTodoDto {
  @IsDefined()
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateTodoDto) // This is required to validate `payload`
  @ApiProperty()
  payload: UpdateTodoDto;
}
