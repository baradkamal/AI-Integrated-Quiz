import { TestBed } from '@angular/core/testing';

import { GenAiApiService } from './gen-ai-api.service';

describe('GenAiApiService', () => {
  let service: GenAiApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenAiApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
