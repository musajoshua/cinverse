import { ReviewOwnershipGuard } from './review-ownership.guard';

describe('ReviewOwnershipGuard', () => {
  it('should be defined', () => {
    expect(new ReviewOwnershipGuard()).toBeDefined();
  });
});
