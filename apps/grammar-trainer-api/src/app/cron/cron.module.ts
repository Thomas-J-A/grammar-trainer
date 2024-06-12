import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CronService } from './cron.service';
import { CronRepository } from './cron.repository';

@Module({
  imports: [PrismaModule],
  providers: [CronService, CronRepository],
})
export class CronModule {}
