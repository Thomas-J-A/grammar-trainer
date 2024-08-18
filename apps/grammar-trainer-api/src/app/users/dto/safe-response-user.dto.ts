import { Expose } from 'class-transformer';

/**
 * User details without the credentials to send back to client.
 */
export class SafeResponseUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
