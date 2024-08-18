import { Expose } from 'class-transformer';

/**
 * User details suitable for adding to the request object.
 *
 * Follows principle of least privilege by removing unnecessary sensitive fields.
 */
export class RequestObjectUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lockoutExpiry: Date;
}
