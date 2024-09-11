import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';

class UserDto {
  @IsUUID(4)
  id: string;

  @IsEmail()
  email: string;

  @IsAscii()
  @MaxLength(72) // bcrypt's limit
  @IsNotEmpty()
  password: string;
}

class _UserDtoNoId extends OmitType(UserDto, ['id'] as const) {}

export class CreateUserDto extends PickType(_UserDtoNoId, [
  'email',
  'password',
] as const) {}
export class UpdateUserDto extends PartialType(_UserDtoNoId) {}
