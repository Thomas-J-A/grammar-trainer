import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PasswordResetTokensService } from './password-reset-tokens.service';
import { PasswordResetTokensRepository } from './password-reset-tokens.repository';

@Module({
  imports: [PrismaModule],
  providers: [PasswordResetTokensService, PasswordResetTokensRepository],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
