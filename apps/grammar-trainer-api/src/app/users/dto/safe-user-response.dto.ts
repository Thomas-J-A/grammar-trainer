import { Expose } from 'class-transformer';

/**
 * User details without the credentials.
 */
export class SafeUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
