import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayloadData {
  sub: string;
}

interface JwtPayload extends JwtPayloadData {
  iat: number;
  exp: number;
}

export interface JwtParsedData {
  userId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      // NOTE: 라이브러리의 버그인지 설계인지, `passReqToCallback` 를 `true` 로만 요구.
      passReqToCallback: true,
    });
  }

  async validate(_: Request, payload: JwtPayload): Promise<JwtParsedData> {
    return { userId: payload.sub };
  }
}
