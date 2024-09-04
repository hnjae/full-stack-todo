import { PickType } from '@nestjs/swagger';
import { IsAscii, IsEmail, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

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

export class CreateUserDto extends PickType(UserDto, ['email', 'password'] as const) {}
