/*
  README:

  `TokenEndpointGuard` is
    - assumed to be used in `token` endpoint.
*/
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { TokenPasswordGrantGuard } from './token-password-grant.guard';

@Injectable()
export class TokenEndpointGuard implements CanActivate {
  constructor(
    private readonly tokenPasswordGrantGuard: TokenPasswordGrantGuard,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { grant_type } = request.body;

    if (grant_type === 'password') {
      return this.tokenPasswordGrantGuard.canActivate(context);
    } else if (grant_type === 'refresh_token') {
      // TODO: implement this <2025-02-28>
      throw new Error('Not implemented');
    }

    // This code should not be executed as it will be filtered by class-validator.
    return false;
  }
}
