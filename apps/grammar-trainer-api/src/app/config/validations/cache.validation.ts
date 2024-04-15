import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Class representing cache-related environment variables.
 */
export class CacheVariables {
  @Expose()
  @IsOptional()
  @IsString()
  CACHE_HOST?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  CACHE_PORT?: number;
}
