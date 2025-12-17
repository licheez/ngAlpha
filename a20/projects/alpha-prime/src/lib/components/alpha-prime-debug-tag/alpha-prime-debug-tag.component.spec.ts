import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeDebugTagComponent } from './alpha-prime-debug-tag.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeDebugTag', () => {
  let component: AlphaPrimeDebugTagComponent;
  let fixture: ComponentFixture<AlphaPrimeDebugTagComponent>;

  const mockService: Partial<AlphaPrimeService> = {
    isProduction: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDebugTagComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockService }
      ]
    })
    .compileComponents();

    // ensure clean localStorage for each test
    localStorage.removeItem('alphaHideDebugTag');

    fixture = TestBed.createComponent(AlphaPrimeDebugTagComponent);
    component = fixture.componentInstance;
    // provide the required `tag` input as a string before ngOnInit runs
    (component as any).tag = 'debug';
  });

  afterEach(() => {
    // cleanup localStorage between tests
    localStorage.removeItem('alphaHideDebugTag');
  });

  it('should create and be visible when not hidden and not production', () => {
    // run lifecycle explicitly so test is deterministic
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.tag).toBe('debug');
    expect(component.tagSignal()).toBe('debug');
    expect(component.visible).toBeTrue();
  });

  it('should be hidden when localStorage alphaHideDebugTag is true', () => {
    // set localStorage before calling ngOnInit to simulate persisted state
    localStorage.setItem('alphaHideDebugTag', 'true');

    // re-run init to pick up the value
    component.ngOnInit();

    expect(component.visible).toBeFalse();
  });

  it('should set alphaHideDebugTag and hide when service reports production', () => {
    // simulate production mode by flipping the injected service flag
    (component as any).mPs.isProduction = true;
    // call ngOnInit to trigger production logic
    component.ngOnInit();

    expect(localStorage.getItem('alphaHideDebugTag')).toBe('true');
    expect(component.visible).toBeFalse();
  });

  it('tag input setter should update internal signal', () => {
    component.tag = 'new-tag';
    expect(component.tagSignal()).toBe('new-tag');
    expect(component.tag).toBe('new-tag');
  });

});
