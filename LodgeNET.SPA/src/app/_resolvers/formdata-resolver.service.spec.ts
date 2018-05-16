/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormdataResolverService } from './formdata-resolver.service';

describe('Service: FormdataResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormdataResolverService]
    });
  });

  it('should ...', inject([FormdataResolverService], (service: FormdataResolverService) => {
    expect(service).toBeTruthy();
  }));
});
