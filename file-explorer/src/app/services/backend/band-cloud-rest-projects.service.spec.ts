import { TestBed } from '@angular/core/testing';

import { BandCloudRestProjectsService } from './band-cloud-rest-projects.service';

describe('BandCloudRestProjectsService', () => {
  let service: BandCloudRestProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandCloudRestProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
