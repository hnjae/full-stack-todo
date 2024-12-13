import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  async logIn(userDto: LoginUserDto) {
    const user = await this.usersService.get(userDto.email, {
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
    const payload = {
      sub: user.id,
      /*
        NOTE:
          * `Date.now()` 는 1970-01-01T00:00:00Z 를 기준으로 elapsed 한 milliseconds을 출력
          * json 의 NumericDate 의 단위는 second
          * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now>
      */
      iat: Math.trunc(Date.now() / 1000),
      /*
        NOTE:

        exp 는 JwtModule의 signOptions.expiresIn 을 사용한다면 선언해서는 안됨

        >
        > There are no default values for expiresIn, notBefore, audience, subject, issuer. These claims can also be provided in the payload directly with exp, nbf, aud, sub and iss respectively, but you can't include in both places.
        > <https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#jwtsignpayload-secretorprivatekey-options-callback>
        >
      */
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
