import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Repository for handling cron job interactions with database.
 */
@Injectable()
export class CronRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cleanup expired reset tokens.
   */
  async cleanupExpiredTokens() {
    return this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lte: new Date() },
      },
    });
  }
}
