import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

/**
 * Class representing session-related environment variables.
 *
 * NOTE: Since enableImplicitConversion option is set to true, the config object with its
 * string values always has any Boolean-intended values converted to Boolean true since
 * they are all non-empty strings. Therefore, the Transform decorator is used on Boolean
 * properties to ensure the true conversion occurs ('true' becomes true, 'false' becomes false).
 */
export class SessionVariables {
  @Expose()
  @IsString()
  SESSION_SECRET: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  SESSION_MAX_AGE: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => obj.SESSION_ROLLING === 'true')
  SESSION_ROLLING?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => obj.SESSION_RESAVE === 'true')
  SESSION_RESAVE?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => obj.SESSION_SAVE_UNINITIALIZED === 'true')
  SESSION_SAVE_UNINITIALIZED?: boolean;
}
