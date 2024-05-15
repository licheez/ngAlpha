import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsCustFormComponent } from './ems-cust-form.component';

describe('PsEmsCustFormComponent', () => {
  let component: EmsCustFormComponent;
  let fixture: ComponentFixture<EmsCustFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsCustFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmsCustFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
