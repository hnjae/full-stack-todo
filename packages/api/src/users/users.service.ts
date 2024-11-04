import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto, UpdateUserDto, UserDto } from './users.dto';

function excludeSensitive(user: UserDto): Partial<UserDto> {
  const keys: (keyof UserDto)[] = ['id', 'password'];

  return Object.fromEntries(
    Object.entries(user).filter(
      ([key]) => !keys.includes(key as keyof UserDto),
    ),
  );
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

  async get(email: string, opts = { includeSensitive: false }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user == null) {
      return null;
    }

    if (opts.includeSensitive) {
      return user;
    }

    return excludeSensitive(user);
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };
    if (data.password != null) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: data,
    });

    return excludeSensitive(user);
  }

  async delete(email: string) {
    const user = await this.prisma.user.delete({
      where: { email: email },
    });

    return excludeSensitive(user);
  }
}
