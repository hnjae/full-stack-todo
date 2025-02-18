import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto, UpdateUserDto, UserDto } from './users.dto';

function excludeSensitive(user: UserDto): Omit<UserDto, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => excludeSensitive(user));
  }

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // 10: saltRounds

    const user = await this.prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    return excludeSensitive(user);
  }

  async get<T extends boolean = false>(
    id: string,
    opts = { includeSensitive: false as T },
  ): Promise<null | (T extends true ? UserDto : Omit<UserDto, 'password'>)> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (user == null) {
      return null;
    }

    if (opts.includeSensitive) {
      return user;
    }

    return excludeSensitive(user) as T extends true
      ? UserDto
      : Omit<UserDto, 'password'>;
  }

  async getByEmail<T extends boolean = false>(
    email: string,
    opts = { includeSensitive: false as T },
  ): Promise<null | (T extends true ? UserDto : Omit<UserDto, 'password'>)> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user == null) {
      return null;
    }

    if (opts.includeSensitive) {
      return user;
    }

    return excludeSensitive(user) as T extends true
      ? UserDto
      : Omit<UserDto, 'password'>;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password != null) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });

    return excludeSensitive(user);
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: { id: id },
    });

    return excludeSensitive(user);
  }
}
