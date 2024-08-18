import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

/**
 * Service responsible for serializing and deserializing user sessions.
 * Provides methods used by PassportJS to serialize and deserialize a user.
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  /**
   * Serialize a user object into the session.
   *
   * @param {any} user - The user object to serialize.
   * @param {Function} done - The callback function used to indicate completion.
   */
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user.id);
  }

  /**
   * Deserialize a user object from the session.
   *
   * @param {string} userId - The user ID used to deserialize user.
   * @param {Function} done - The callback function used to indicate completion.
   */
  async deserializeUser(
    userId: string,
    done: (err: Error, payload: any) => void
  ) {
    // Look for user with serialized id in database
    const user = await this.usersService.findUserById(Number(userId));

    // Throw an error if no user with serialized id found in database
    if (!user) {
      return done(
        new Error(
          `Could not deserialize user: user with id ${userId} could not be found`
        ),
        null
      );
    }

    // Sanitize user before adding to request object
    const sanitizedUser = this.usersService.sanitizeUserForRequestObject(user);

    done(null, sanitizedUser);
  }
}
