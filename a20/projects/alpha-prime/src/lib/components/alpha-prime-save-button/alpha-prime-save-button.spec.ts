import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeSaveButton } from './alpha-prime-save-button';

describe('AlphaPrimeSaveButton', () => {
  let component: AlphaPrimeSaveButton;
  let fixture: ComponentFixture<AlphaPrimeSaveButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSaveButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSaveButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
