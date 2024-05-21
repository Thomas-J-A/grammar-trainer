import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user.id);
  }

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
    const sanitizedUser = this.usersService.sanitizeUser(user);

    done(null, sanitizedUser);
  }
}
