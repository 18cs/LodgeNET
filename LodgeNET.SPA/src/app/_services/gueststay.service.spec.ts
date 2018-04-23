/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GueststayService } from './gueststay.service';

describe('Service: Gueststay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GueststayService]
    });
  });

  it('should ...', inject([GueststayService], (service: GueststayService) => {
    expect(service).toBeTruthy();
  }));
});
