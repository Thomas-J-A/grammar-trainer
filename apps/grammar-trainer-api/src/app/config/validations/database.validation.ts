import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Class representing database-related environment variables.
 */
export class DatabaseVariables {
  @Expose()
  @IsOptional()
  @IsString()
  DB_HOST?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  DB_PORT?: number;

  @Expose()
  @IsString()
  DB_NAME: string;

  @Expose()
  @IsString()
  DB_USER: string;

  @Expose()
  @IsString()
  DB_PASSWORD: string;

  @Expose()
  @IsString()
  DATABASE_URL: string;
}
