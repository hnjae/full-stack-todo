import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto, UserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

import { JwtPayloadData } from './jwt.strategy';
import { TokenRequestDto } from './token-request.dto';

// TODO: limit number of refresh tokken issued <2025-03-10>
// TODO: test 를 위해 expiresIn 을 길게 잡음. 나중에 수정할 것 <2024-12-12>
const ACCESS_TOKEN_EXPIRES_IN = 86400; // 단위 seconds
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async register(userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  async validate(userDto: LoginUserDto) {
    const user = await this.usersService.getByEmail(userDto.email, {
      includeSensitive: true,
    });

    if (user == null) {
      return false;
    }

    if (!(await bcrypt.compare(userDto.password, user.password))) {
      return false;
    }

    return true;
  }

  async issueRefreshToken(userId: string) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + REFRESH_TOKEN_EXPIRES_IN;

    const registered = await this.prismaService.refreshToken.create({
      data: {
        userId: userId,
        expiresAt: new Date(exp * 1000),
        issuedAt: new Date(iat * 1000),
      },
    });

    const payload = {
      sub: userId,
      jti: registered.id,
      exp,
      iat,
    };

    const token = this.jwtService.signAsync(payload);

    return token;
  }

  /**
   * Returns a token response.
   *
   * @remarks
   * The user and password match is assumed to be verified before this operation.
   */
  async generateTokenResponse(tokenRequestDto: TokenRequestDto) {
    let user: Omit<UserDto, 'password'> | null = null;

    if (tokenRequestDto.grant_type == 'password') {
      user = await this.usersService.getByEmail(tokenRequestDto.username);
    } else {
      throw new Error('Not implemented');
    }

    if (user == null) {
      return null;
    }

    // NOTE: https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
    const payload: JwtPayloadData = {
      sub: user.id,
      /*
        NOTE:
        iat 는 JwtModule 에서 알아서 처리해준다.
        exp 는 JwtModule의 signOptions.expiresIn 을 사용한다면 선언해서는 안됨

        >
        > There are no default values for expiresIn, notBefore, audience, subject, issuer. These claims can also be provided in the payload directly with exp, nbf, aud, sub and iss respectively, but you can't include in both places.
        > <https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#jwtsignpayload-secretorprivatekey-options-callback>
        >
      */
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }),
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_EXPIRES_IN,
      refresh_token: await this.issueRefreshToken(user.id),
    };
  }
}
