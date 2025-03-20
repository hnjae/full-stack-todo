import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TodoListsModule } from './todo-lists/todo-lists.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validate: (config) => {
        const configSchema = z.object({
          JWT_SECRET: z.string().min(1),
          APP_URL: z.string().url(),
        });
        return configSchema.parse(config);
      },
      // envFilePath: '.env.production',
    }),
    UsersModule,
    AuthModule,
    TodosModule,
    TodoListsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
