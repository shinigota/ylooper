import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoopMenuVideoComponent} from './loop-menu-video.component';

describe('LoopMenuVideoComponent', () => {
  let component: LoopMenuVideoComponent;
  let fixture: ComponentFixture<LoopMenuVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopMenuVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopMenuVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
