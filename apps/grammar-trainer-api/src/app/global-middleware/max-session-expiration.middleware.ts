import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MAX_SESSION_DURATION } from '../app.constants';

/**
 * Middleware for ensuring rolling sessions don't continue indefinitely.
 *
 * This is a security feature preventing session hijacking.
 */
@Injectable()
export class MaxSessionExpirationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.createdAt) {
      // Calculate the duration of the current session
      const now = Date.now();
      const sessionAge = now - req.session.createdAt;

      if (sessionAge > MAX_SESSION_DURATION) {
        // Destroy current rolling session since it has exceeded max duration
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session (max duration):', err);
            return next(err);
          }
        });

        // Clear session cookie in client browser
        res.clearCookie('connect.sid');

        throw new UnauthorizedException(
          'Maximum session duration has been exceeded'
        );
      }
    } else {
      // Initialize session creation time
      req.session.createdAt = Date.now();
    }

    next();
  }
}
