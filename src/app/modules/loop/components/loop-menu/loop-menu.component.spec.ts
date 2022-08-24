import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoopMenuComponent} from './loop-menu.component';

describe('LoopMenuComponent', () => {
  let component: LoopMenuComponent;
  let fixture: ComponentFixture<LoopMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
