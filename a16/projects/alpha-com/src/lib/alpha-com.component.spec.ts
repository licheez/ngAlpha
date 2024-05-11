import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaComComponent } from './alpha-com.component';

describe('AlphaComComponent', () => {
  let component: AlphaComComponent;
  let fixture: ComponentFixture<AlphaComComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphaComComponent]
    });
    fixture = TestBed.createComponent(AlphaComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
