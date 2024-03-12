import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsDemoComponent } from './ts-demo.component';

describe('TsDemoComponent', () => {
  let component: TsDemoComponent;
  let fixture: ComponentFixture<TsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
