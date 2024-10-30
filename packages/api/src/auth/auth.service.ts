import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  // async validateUser(email: string, password: string) {
  //   const user = await this.usersService.get(email);
  // }

  // async logout(userDto) {}
}
