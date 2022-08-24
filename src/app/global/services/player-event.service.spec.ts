import { TestBed } from '@angular/core/testing';

import { PlayerEventService } from './player-event.service';

describe('PlayerEventService', () => {
  let service: PlayerEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
