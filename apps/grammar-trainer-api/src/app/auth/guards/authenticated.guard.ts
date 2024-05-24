import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Guard for checking authentication status of client request.
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
