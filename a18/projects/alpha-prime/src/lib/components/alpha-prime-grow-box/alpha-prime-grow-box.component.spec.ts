import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeGrowBoxComponent } from './alpha-prime-grow-box.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('AlphaPrimeGrowComponent', () => {
  let component: AlphaPrimeGrowBoxComponent;
  let fixture: ComponentFixture<AlphaPrimeGrowBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AlphaPrimeGrowBoxComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeGrowBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle expanded setter', () => {
    component.expanded = true;
    expect(component.isCollapsed).toBeFalsy();
    expect(component.keepExpanded).toBeTruthy();
  });

  it ('should handle collapsed setter', () => {
    component.keepExpanded = true;
    component.collapsed = true;
    expect(component.isCollapsed).toBeTruthy();
    expect(component.keepExpanded).toBeTruthy();
  });

  it('should handle onHover', () => {
    component.onHover();
    expect(component.isCollapsed).toBeFalsy();
  });

  it('should handle onLeave when keepExpanded', () => {
    component.isCollapsed = false;
    component.keepExpanded = true;
    component.onLeave();
    expect(component.isCollapsed).toBeFalsy();
    component.keepExpanded = false;
    component.onLeave();
    expect(component.isCollapsed).toBeTruthy();
  })

});
