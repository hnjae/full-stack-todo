import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TokenPasswordGrantGuard extends AuthGuard(
  'token-password-grant',
) {}
