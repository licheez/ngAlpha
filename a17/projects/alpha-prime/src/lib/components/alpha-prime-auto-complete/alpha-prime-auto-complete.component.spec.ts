import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeAutoCompleteComponent } from './alpha-prime-auto-complete.component';

describe('AlphaPrimeAutoCompleteComponent', () => {
  let component: AlphaPrimeAutoCompleteComponent;
  let fixture: ComponentFixture<AlphaPrimeAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeAutoCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeAutoCompleteComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
