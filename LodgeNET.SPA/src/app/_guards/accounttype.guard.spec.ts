/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountTypeGuard } from './accountType.guard';

describe('AccountTypeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountTypeGuard]
    });
  });

  it('should ...', inject([AccountTypeGuard], (guard: AccountTypeGuard) => {
    expect(guard).toBeTruthy();
  }));
});