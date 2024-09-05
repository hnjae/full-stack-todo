// TODO: remove id & hashed password from return ofmethods <2024-09-04>

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.user.findMany();
  }

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const hashedPassword = await bcrypt.hash(userDto.password, 10); // 10: saltRounds
    const user = await this.prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    return user;
  }

  async get(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user == null) {
      return null;
    }

    return user;
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

    return user;
  }

  async delete(email: string) {
    const user = await this.prisma.user.delete({
      where: { email: email },
    });

    if (user == null) {
      return null;
    }

    return user;
  }
}
