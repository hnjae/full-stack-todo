import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
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

  it(`/POST auth/register user`, async () => {
    const user = {
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
    const user = {
      email: 'example2@example.com',
      password: 'unhashed-password',
    };

    mockPrismaService.user.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('An error occurred', {
        code: 'P2002',
        clientVersion: '5.19.0',
      }),
    );

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(409);
  });
});
