import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import * as request from 'supertest';

describe('Users', () => {
  let app: INestApplication;

  const mockPrismaService = mockDeep<PrismaService>();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it(`/GET all`, () => {
    const users = [
      {
        id: 'bb70a9a3-6eb8-45c9-b006-ca085517bcf8',
        email: 'example@example.com',
        password: 'hashed-password',
        createdAt: new Date('2024-09-23T15:27:53Z'),
      },
      {
        id: '35d078a5-48aa-4a37-ad7c-ab7de27d8a35',
        email: 'example2@example2.com',
        password: 'hashed-password2',
        createdAt: new Date('2024-09-23T15:28:04Z'),
      },
    ];
    const expectedReturns = [
      {
        id: 'bb70a9a3-6eb8-45c9-b006-ca085517bcf8',
        email: 'example@example.com',
        createdAt: '2024-09-23T15:27:53.000Z',
      },
      {
        id: '35d078a5-48aa-4a37-ad7c-ab7de27d8a35',
        email: 'example2@example2.com',
        createdAt: '2024-09-23T15:28:04.000Z',
      },
    ];
    mockPrismaService.user.findMany.mockResolvedValueOnce(users);

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(expectedReturns);
  });

  it(`/POST create user`, async () => {
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
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201);

    expect(response.body.email).toEqual(user.email);

    return response;
  });

  it(`/POST same email as existing user`, async () => {
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

  it(`/POST bad requests`, async () => {
    const user = {
      email: 'not-an-email',
      password: 'unhashed-password',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .set('Accept', 'application/json')
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
