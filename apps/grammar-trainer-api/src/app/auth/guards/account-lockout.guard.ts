import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestObjectUserDto } from '../../users/dto/request-object-user.dto';

/**
 * Guard for checking if a user account is locked.
 *
 * Although primarily used after authentication checks where user has a valid session,
 * this guards against scenarios where user accounts may be blocked after initial authentication
 * due to subsequent security concerns or administrative actions.
 */
@Injectable()
export class AccountLockoutGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get reference to req object
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as RequestObjectUserDto;

    // Check whether account is locked or not
    // Generally this guard comes after the authentication guard so the check for a user
    // isn't strictly necessary. It is kept as a precaution.
    if (user && user.lockoutExpiry && new Date() < user.lockoutExpiry) {
      throw new ForbiddenException('Account is locked. Try again later');
    }

    return true;
  }
}
