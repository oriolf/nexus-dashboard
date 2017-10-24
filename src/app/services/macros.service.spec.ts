import { TestBed, inject } from '@angular/core/testing';

import { MacrosService } from './macros.service';

describe('MacrosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MacrosService]
    });
  });

  it('should be created', inject([MacrosService], (service: MacrosService) => {
    expect(service).toBeTruthy();
  }));
});
