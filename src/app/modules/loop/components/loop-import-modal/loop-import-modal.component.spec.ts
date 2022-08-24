import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoopImportModalComponent} from './loop-import-modal.component';

describe('LoopImportModalComponent', () => {
  let component: LoopImportModalComponent;
  let fixture: ComponentFixture<LoopImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopImportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
