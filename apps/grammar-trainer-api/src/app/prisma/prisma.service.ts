import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service for setting up Prisma.
 * Initializes Prisma Client, connects Prisma to database, and gracefully disconnects.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Connect app to database on init.
   */
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to database');
    } catch (e) {
      console.error('Error connecting to database');
      process.exit(1);
    }
  }

  /**
   * Gracefully disconnect from database on app shutdown.
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Disconnected from database');
  }
}
