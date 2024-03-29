import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(email: string, password: string) {
    // Verify that a user with same email doesn't already exist
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException(`A user with email ${email} already exists`);
    }

    // Add new user to db
    const newUser = await this.usersService.createUser(email, password);

    return newUser;
  }

  // Validate submitted credentials against those stored in db
  async validateUser(email: string, password: string) {
    // Fetch user from db
    const user = await this.usersService.findUserByEmail(email);

    // Verify user with submitted email exists
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Verify submitted password matches hashed password in db
    // const isMatch = await this.verifyPassword(password, user.password);
    // if (!isMatch) {
    //   throw new UnauthorizedException('Incorrect email or password');
    // }
    if (password !== user.password) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return user;
  }

  // Verify that submitted password matches the hash stored in db
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
