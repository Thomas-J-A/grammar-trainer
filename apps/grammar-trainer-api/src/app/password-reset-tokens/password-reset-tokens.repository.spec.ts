import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetTokens } from './password-reset-tokens.repository';

describe('PasswordResetTokens', () => {
  let provider: PasswordResetTokens;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetTokens],
    }).compile();

    provider = module.get<PasswordResetTokens>(PasswordResetTokens);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
