import { TestBed } from '@angular/core/testing';

import { BandCloudRestService } from './band-cloud-rest.service';

describe('BandCloudRestService', () => {
  let service: BandCloudRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandCloudRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
