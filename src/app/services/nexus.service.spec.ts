import { TestBed, inject } from '@angular/core/testing';

import { NexusService } from './nexus.service';

describe('NexusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NexusService]
    });
  });

  it('should be created', inject([NexusService], (service: NexusService) => {
    expect(service).toBeTruthy();
  }));
});
