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

  deserializeUser(userId: string, done: (err: Error, payload: any) => void) {
    const user = this.usersService.findUserById(Number(userId));

    if (!user) {
      return done(
        new Error(
          `Could not deserialize user: user with id ${userId} could not be found`
        ),
        null
      );
    }

    done(null, user);
  }
}
