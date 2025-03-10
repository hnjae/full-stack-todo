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

const refreshTokenSchema = z
  .object({
    grant_type: z.string(),
    refresh_token: z.string(),
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
      const parsedRequest = passwordSchema.safeParse(request.body);

      if (!parsedRequest.success) {
        throw new BadRequestException({
          error: 'invalid_request',
          error_description:
            'Missing required parameter or includes an unsupported parameter.',
        });
      }

      const userOrFalse = await this.authService.validatePassword({
        email: parsedRequest.data.username,
        password: parsedRequest.data.password,
      });

      if (!userOrFalse) {
        throw new BadRequestException({
          error: 'invalid_grant',
          error_description: 'Invalid username or password.',
        });
      }

      // attach user to request object
      request.user = userOrFalse;

      return true;
    }

    if (grant_type === 'refresh_token') {
      const parsedRequest = refreshTokenSchema.safeParse(request.body);

      if (!parsedRequest.success) {
        throw new BadRequestException({
          error: 'invalid_request',
          error_description:
            'Missing required parameter or includes an unsupported parameter.',
        });
      }

      const userOrFalse = await this.authService.validateAndRotateRefreshToken(
        parsedRequest.data.refresh_token,
      );

      if (!userOrFalse) {
        throw new BadRequestException({
          error: 'invalid_grant',
          error_description: 'Token is expired or invalid.',
        });
      }

      // attach user to request object
      request.user = userOrFalse;

      return true;
    }

    throw new BadRequestException({
      error: 'unsupported_grant_type',
    });
  }
}
