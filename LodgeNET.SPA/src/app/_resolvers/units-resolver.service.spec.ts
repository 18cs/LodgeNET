/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnitsResolverService } from './units-resolver.service';

describe('Service: UnitsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitsResolverService]
    });
  });

  it('should ...', inject([UnitsResolverService], (service: UnitsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
