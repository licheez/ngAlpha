import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComHeaderComponent } from './com-header.component';

describe('ComHeaderComponent', () => {
  let component: ComHeaderComponent;
  let fixture: ComponentFixture<ComHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
