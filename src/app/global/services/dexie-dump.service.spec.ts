import {TestBed} from '@angular/core/testing';

import {DexieDumpService} from './dexie-dump.service';

describe('DexieDumpService', () => {
  let service: DexieDumpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexieDumpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
