import { AuthNGuard } from './authn.guard';

describe('AuthNGuard', () => {
  it('should be defined', () => {
    expect(new AuthNGuard()).toBeDefined();
  });
});
