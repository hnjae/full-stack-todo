import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    const { email } = userDto;
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    // TODO: remove hashed password from this <2024-09-04>
    return user;
  }
}
