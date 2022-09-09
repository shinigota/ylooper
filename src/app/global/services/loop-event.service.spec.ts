import {TestBed} from '@angular/core/testing';

import {LoopEventService} from './loop-event.service';

describe('LoopEventService', () => {
  let service: LoopEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoopEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
