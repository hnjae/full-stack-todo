/*
  README:

  `TokenEndpointGuard` is
    - assumed to be used in `token` endpoint.

  NOTE: https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
*/
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { z } from 'zod';

import { AuthService } from './auth.service';

const passwordSchema = z
  .object({
    grant_type: z.string(),
    username: z.string(),
    password: z.string(),
  })
  .strict();

@Injectable()
export class TokenEndpointGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'];
    const { grant_type } = request.body;

    if (contentType !== 'application/x-www-form-urlencoded') {
      throw new BadRequestException({
        error: 'invalid_request',
        error_description:
          'Content-Type must be application/x-www-form-urlencoded.',
      });
    }

    if (grant_type == null) {
      throw new BadRequestException({
        error: 'invalid_request',
        error_description: 'grant_type is required.',
      });
    }

    if (grant_type === 'password') {
      const validate_schema = passwordSchema.safeParse(request.body);

      if (!validate_schema.success) {
        throw new BadRequestException({
          error: 'invalid_request',
          error_description:
            'Missing required parameter or includes an unsupported parameter.',
        });
      }

      const isAuthenticatable = await this.authService.validate({
        email: validate_schema.data.username,
        password: validate_schema.data.password,
      });

      if (!isAuthenticatable) {
        throw new BadRequestException({
          error: 'invalid_grant',
          error_description: 'Invalid username or password.',
        });
      }

      return true;
    }

    if (grant_type === 'refresh_token') {
      // TODO: implement this <2025-02-28>
      throw new BadRequestException({
        error: 'unsupported_grant_type',
      });
    }

    throw new BadRequestException({
      error: 'unsupported_grant_type',
    });
  }
}
