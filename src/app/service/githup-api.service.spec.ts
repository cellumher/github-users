import { TestBed } from '@angular/core/testing';

import { GithupApiService } from './githup-api.service';

describe('GithupApiService', () => {
  let service: GithupApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GithupApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
