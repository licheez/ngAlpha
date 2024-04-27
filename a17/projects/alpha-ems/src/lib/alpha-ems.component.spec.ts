import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaEmsComponent } from './alpha-ems.component';

describe('AlphaEmsComponent', () => {
  let component: AlphaEmsComponent;
  let fixture: ComponentFixture<AlphaEmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaEmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphaEmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
