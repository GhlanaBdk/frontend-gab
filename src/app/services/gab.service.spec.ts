import { TestBed } from '@angular/core/testing';

import { GabService } from './gab.service';

describe('GabService', () => {
  let service: GabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
