import { AccountLockoutGuard } from './account-lockout.guard';

describe('AccountLockoutGuard', () => {
  it('should be defined', () => {
    expect(new AccountLockoutGuard()).toBeDefined();
  });
});
