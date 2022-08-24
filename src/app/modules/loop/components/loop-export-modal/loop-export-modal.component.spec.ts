import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoopExportModalComponent} from './loop-export-modal.component';

describe('LoopExportModalComponent', () => {
  let component: LoopExportModalComponent;
  let fixture: ComponentFixture<LoopExportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopExportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
