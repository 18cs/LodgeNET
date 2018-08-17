/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileexportService } from './fileexport.service';

describe('Service: Fileexport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileexportService]
    });
  });

  it('should ...', inject([FileexportService], (service: FileexportService) => {
    expect(service).toBeTruthy();
  }));
});
