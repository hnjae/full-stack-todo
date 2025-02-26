import { IsIn, IsJWT, IsString, ValidateIf } from 'class-validator';

export class TokenRequestDto {
  @IsIn(['password', 'refresh_token'])
  grant_type: 'password' | 'refresh_token';

  @ValidateIf((o) => o.grant_type === 'password')
  @IsString()
  username: string;

  @ValidateIf((o) => o.grant_type === 'password')
  @IsString()
  password: string;

  @ValidateIf((o) => o.grant_type === 'refresh_token')
  @IsJWT()
  refresh_token: string;
}
