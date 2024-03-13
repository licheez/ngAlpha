import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaOasComponent } from './alpha-oas.component';

describe('AlphaOasComponent', () => {
  let component: AlphaOasComponent;
  let fixture: ComponentFixture<AlphaOasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaOasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphaOasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
