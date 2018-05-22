/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BuildingsResolverService } from './buildings-resolver.service';

describe('Service: BuildingsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildingsResolverService]
    });
  });

  it('should ...', inject([BuildingsResolverService], (service: BuildingsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
