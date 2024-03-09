import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaTsComponent } from './alpha-ts.component';

describe('AlphaTsComponent', () => {
  let component: AlphaTsComponent;
  let fixture: ComponentFixture<AlphaTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphaTsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
