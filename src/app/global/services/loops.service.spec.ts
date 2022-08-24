/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {LoopsService} from './loops.service';

describe('Service: Loops', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoopsService]
    });
  });

  it('should ...', inject([LoopsService], (service: LoopsService) => {
    expect(service).toBeTruthy();
  }));
});
