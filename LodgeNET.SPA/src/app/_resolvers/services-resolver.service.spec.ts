/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicesResolverService } from './services-resolver.service';

describe('Service: ServicesResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicesResolverService]
    });
  });

  it('should ...', inject([ServicesResolverService], (service: ServicesResolverService) => {
    expect(service).toBeTruthy();
  }));
});
