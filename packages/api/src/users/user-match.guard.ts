/*
  README:

  `UserMatchGuard` is
    - assumed to be used after `JwtAuthGuard`.
    - assumed `@Param('userId')` as argument in controller to get the user id
*/
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtParsedData } from 'src/auth/jwt.strategy';

@Injectable()
export class UserMatchGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtParsedData;

    if (user?.userId == null) {
      throw new InternalServerErrorException(
        'UserMatchGuard requires user with userId',
      );
    }

    if (request.params.userId == null) {
      throw new InternalServerErrorException(
        'UserMatchGuard requires id parameter',
      );
    }

    if (user.userId !== request.params.userId) {
      throw new ForbiddenException('You can only access your own resources');
    }

    return true;
  }
}
