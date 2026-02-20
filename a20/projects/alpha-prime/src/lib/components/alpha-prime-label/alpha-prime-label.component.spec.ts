import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeLabelComponent } from './alpha-prime-label.component';

describe('AlphaPrimeLabel', () => {
  let component: AlphaPrimeLabelComponent;
  let fixture: ComponentFixture<AlphaPrimeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
