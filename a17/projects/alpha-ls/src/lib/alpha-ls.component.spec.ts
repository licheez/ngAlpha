import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaLsComponent } from './alpha-ls.component';

describe('AlphaLsComponent', () => {
  let component: AlphaLsComponent;
  let fixture: ComponentFixture<AlphaLsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaLsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphaLsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
