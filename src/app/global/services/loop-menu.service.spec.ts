import {TestBed} from '@angular/core/testing';

import {LoopMenuService} from './loop-menu.service';

describe('LoopMenuService', () => {
  let service: LoopMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoopMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
