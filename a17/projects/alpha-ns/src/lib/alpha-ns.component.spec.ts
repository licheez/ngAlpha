import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaNsComponent } from './alpha-ns.component';

describe('AlphaNsComponent', () => {
  let component: AlphaNsComponent;
  let fixture: ComponentFixture<AlphaNsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaNsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlphaNsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
