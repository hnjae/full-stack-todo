import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { mockDeep } from 'jest-mock-extended';
import * as jwt from 'jsonwebtoken';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from 'src/users/users.dto';
import * as request from 'supertest';

describe('auth', () => {
  let app: INestApplication;

  const mockPrismaService = mockDeep<PrismaService>();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it(`/POST auth/register new-user`, async () => {
    const user: CreateUserDto = {
      email: 'example@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.create.mockResolvedValueOnce({
      id: 'ce392f27-1746-474b-ba18-20f9b6b9d09b',
      createdAt: new Date('2024-09-23T15:28:19Z'),
      ...user,
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201);

    expect(response.body).not.toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.email).toEqual(user.email);

    return response;
  });

  it(`/POST auth/register existing-user`, async () => {
    const user: CreateUserDto = {
      email: 'example2@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('An error occurred', {
        code: 'P2002',
        clientVersion: '5.19.0',
      }),
    );

    return await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(409);
  });

  it(`/POST auth/register bad-request`, async () => {
    const user = {
      email: 'example@example.com',
    };

    return await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it(`/POST /auth/login success`, async () => {
    const userDto: LoginUserDto = {
      email: 'example@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: '7f714f74-436a-45ae-ab27-53ca3ab558de',
      createdAt: new Date('2024-07-21T16:38:29Z'),
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    const token = jwt.decode(response.body.accessToken);

    expect(token).toHaveProperty('sub');
    expect(token).toHaveProperty('iat');
    expect(token).toHaveProperty('exp');

    return response;
  });

  it(`/POST /auth/login fail (password-unmatch)`, async () => {
    const userDto: LoginUserDto = {
      email: 'example@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: '9fbcc95b-48e2-49de-a64c-fcbe294d7c4c',
      createdAt: new Date('2014-07-21T16:38:29Z'),
      ...userDto,
      password: await bcrypt.hash('unmatch-password', 10),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .set('Accept', 'application/json')
      .expect(401);

    return response;
  });

  it(`/POST /auth/login fail (does not exist)`, async () => {
    const userDto: LoginUserDto = {
      email: 'example@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userDto)
      .set('Accept', 'application/json')
      .expect(401);

    return response;
  });
});
