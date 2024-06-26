import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Class representing HTTP-related environment variables.
 */
export class HttpVariables {
  @Expose()
  @IsOptional()
  @IsString()
  HOST?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT?: number;
}
