import { TestBed } from '@angular/core/testing';

import { BandCloudRestProjectService } from './band-cloud-rest-project.service';

describe('BandCloudRestProjectService', () => {
  let service: BandCloudRestProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandCloudRestProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
