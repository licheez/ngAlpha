import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbsComponent } from './lbs.component';
import {AlphaLbsModule} from "@pvway/alpha-lbs";

describe('LbsComponent', () => {
  let component: LbsComponent;
  let fixture: ComponentFixture<LbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LbsComponent ],
      imports: [ AlphaLbsModule ] /*,
      providers : [
        {
          provide: AlphaLbsService,
          useValue: null
        }
      ]*/
    })
    .compileComponents();

    fixture = TestBed.createComponent(LbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
