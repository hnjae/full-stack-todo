import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';

@Injectable()
export class TokenPasswordGrantStrategy extends PassportStrategy(
  Strategy,
  'token-password-grant',
) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const is_validate = await this.authService.validate({
      email: username,
      password,
    });

    if (!is_validate) {
      return null;
    }

    return {};
  }
}
