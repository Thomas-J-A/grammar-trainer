import { IsOptional, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Class representing environment-related environment variables.
 */
export class EnvironmentVariables {
  @Expose()
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV?: Environment;
}
