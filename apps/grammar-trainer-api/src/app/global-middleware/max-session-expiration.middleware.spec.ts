import { MaxSessionExpirationMiddleware } from './max-session-expiration.middleware';

describe('MaxSessionExpirationMiddleware', () => {
  it('should be defined', () => {
    expect(new MaxSessionExpirationMiddleware()).toBeDefined();
  });
});
