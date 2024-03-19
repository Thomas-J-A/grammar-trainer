import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

/**
 * Class representing HTTP-related environment variables.
 */
export class HttpVariables {
  @IsOptional()
  @IsString()
  HOST?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT?: number;
}
