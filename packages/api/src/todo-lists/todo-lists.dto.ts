import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
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

export class BatchUpdateTodoListDto {
  @IsDefined()
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateTodoListDto) // do I need this?
  @ApiProperty()
  payload: UpdateTodoListDto;
}
