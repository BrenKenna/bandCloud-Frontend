import { TestBed } from '@angular/core/testing';

import { BandCloudAudioService } from './band-cloud-audio.service';

describe('BandCloudAudioService', () => {
  let service: BandCloudAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BandCloudAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
