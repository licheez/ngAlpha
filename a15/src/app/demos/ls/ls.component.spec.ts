import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LsComponent } from './ls.component';
import {AlphaLsModule} from "../../../../projects/alpha-ls/src/lib/alpha-ls.module";
import {HttpClientTestingModule} from "@angular/common/http/testing";

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
