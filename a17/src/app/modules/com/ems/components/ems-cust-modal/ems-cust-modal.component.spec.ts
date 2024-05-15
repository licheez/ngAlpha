import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsCustModalComponent } from './ems-cust-modal.component';

describe('PsEmsCustModalComponent', () => {
  let component: EmsCustModalComponent;
  let fixture: ComponentFixture<EmsCustModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsCustModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmsCustModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
