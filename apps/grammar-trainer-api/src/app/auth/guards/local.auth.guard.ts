import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/**
 * AuthGuard is a special guard which kicks off the PassportJS authentication flow
 * It calls verify cb (validate method), adds user to request object, and establishes session
 */
Injectable();
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // canActivate call executes the LocalStrategy verify cb to see if req can proceed
    const result = (await super.canActivate(context)) as boolean;

    // Get reference to req object
    const request = context.switchToHttp().getRequest() as Request;

    // Establish a session (by default, AuthGuard doesn't call req.login)
    // Serializes user with passport serializer method
    await super.logIn(request);

    return result;
  }
}
