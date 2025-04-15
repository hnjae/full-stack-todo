import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsAscii,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsAscii()
  @MaxLength(72) // bcrypt's limit
  @IsNotEmpty()
  password: string;

  @IsDate()
  createdAt: Date;
}

class _UserInputDto extends OmitType(UserDto, ['id', 'createdAt'] as const) {}

export class CreateUserDto extends PickType(_UserInputDto, [
  'email',
  'password',
] as const) {}

export class LoginUserDto extends PickType(_UserInputDto, [
  'email',
  'password',
] as const) {}

export class UpdateUserDto extends PartialType(_UserInputDto) {}
