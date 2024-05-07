import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsCustViewComponent } from './ems-cust-view.component';

describe('PsEmsCustViewComponent', () => {
  let component: EmsCustViewComponent;
  let fixture: ComponentFixture<EmsCustViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsCustViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmsCustViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
