import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto, UserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

import { JwtPayloadData } from './jwt.strategy';
import { TokenRequestDto } from './token-request.dto';

// TODO: test 를 위해 expiresIn 을 길게 잡음. 나중에 수정할 것 <2024-12-12>
const JWT_EXPIRES_IN = 86400;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  async login(userDto: LoginUserDto) {
    const user = await this.usersService.getByEmail(userDto.email, {
      includeSensitive: true,
    });

    if (
      user == null ||
      !(await bcrypt.compare(userDto.password, user.password))
    ) {
      // 해당 유저가 없어도 이를 알리지 않고 UnauthorizedException 로 가림.
      throw new UnauthorizedException();
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
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: JWT_EXPIRES_IN,
      }),
    };
  }

  // TODO: username, password 가드 만들기 <2025-02-26>
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
        expiresIn: JWT_EXPIRES_IN,
      }),
      token_type: 'Bearer',
      expires_in: JWT_EXPIRES_IN,
      // refresh_token: <todo>
    };
  }
}
