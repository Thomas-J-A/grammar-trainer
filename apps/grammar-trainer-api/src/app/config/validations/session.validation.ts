import { IsOptional, IsString, IsBoolean } from 'class-validator';

/**
 * Class representing session-related environment variables.
 */
export class SessionVariables {
  @IsString()
  SESSION_SECRET: string;

  // @IsNumber()
  // SESSION_MAX_AGE: number;

  @IsOptional()
  @IsBoolean()
  SESSION_RESAVE?: boolean;

  @IsOptional()
  @IsBoolean()
  SESSION_SAVE_UNINITIALIZED?: boolean;
}
