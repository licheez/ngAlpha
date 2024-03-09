import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LsComponent } from './ls.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AlphaLsModule} from "@pvway/alpha-ls";

describe('LsComponent', () => {
  let component: LsComponent;
  let fixture: ComponentFixture<LsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LsComponent ],
      imports: [
        HttpClientTestingModule,
        AlphaLsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
