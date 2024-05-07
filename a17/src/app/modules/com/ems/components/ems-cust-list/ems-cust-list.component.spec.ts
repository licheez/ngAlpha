import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsCustListComponent } from './ems-cust-list.component';

describe('PsEmsCustListComponent', () => {
  let component: EmsCustListComponent;
  let fixture: ComponentFixture<EmsCustListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsCustListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmsCustListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
