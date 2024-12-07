import { TestBed } from '@angular/core/testing';

import { BecerrosService } from './becerros.service';

describe('BecerrosService', () => {
  let service: BecerrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BecerrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
