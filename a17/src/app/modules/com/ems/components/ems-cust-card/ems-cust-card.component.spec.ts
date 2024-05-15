import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsCustCardComponent } from './ems-cust-card.component';

describe('PsEmsCustCardComponent', () => {
  let component: EmsCustCardComponent;
  let fixture: ComponentFixture<EmsCustCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsCustCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmsCustCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
