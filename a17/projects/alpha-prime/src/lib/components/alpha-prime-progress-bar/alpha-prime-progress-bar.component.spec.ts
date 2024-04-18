import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeProgressBarComponent } from './alpha-prime-progress-bar.component';

describe('AlphaPrimeProgressBarComponent', () => {
  let component: AlphaPrimeProgressBarComponent;
  let fixture: ComponentFixture<AlphaPrimeProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeProgressBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphaPrimeProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
