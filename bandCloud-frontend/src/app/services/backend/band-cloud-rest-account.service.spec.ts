import { TestBed } from '@angular/core/testing';

import { BandCloudRestAccountService } from './band-cloud-rest-account.service';

describe('BandCloudRestAccountService', () => {
  let service: BandCloudRestAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandCloudRestAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
