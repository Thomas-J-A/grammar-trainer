import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Class representing oauth-related environment variables.
 */
export class OauthVariables {
  @Expose()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @Expose()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @Expose()
  @IsString()
  GITHUB_CLIENT_ID: string;

  @Expose()
  @IsString()
  GITHUB_CLIENT_SECRET: string;
}
