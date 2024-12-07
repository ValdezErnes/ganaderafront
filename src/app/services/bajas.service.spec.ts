import { TestBed } from '@angular/core/testing';

import { BajasService } from './bajas.service';

describe('BajasService', () => {
  let service: BajasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BajasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
