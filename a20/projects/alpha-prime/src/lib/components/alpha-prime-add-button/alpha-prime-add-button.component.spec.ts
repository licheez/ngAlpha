// typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {AlphaPrimeAddButtonComponent} from './alpha-prime-add-button.component';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';

describe('AlphaPrimeAddButtonComponent', () => {
  let fixture: ComponentFixture<AlphaPrimeAddButtonComponent>;
  let component: AlphaPrimeAddButtonComponent;
  let mockService: Partial<AlphaPrimeService>;

  beforeEach(async () => {
    mockService = {
      getTr: (k: string) => `tr:${k}`
    };

    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        TooltipModule,
        AlphaPrimeAddButtonComponent],
      providers: [
        {provide: AlphaPrimeService, useValue: mockService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeAddButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default caption from service when empty', () => {
//    component.caption = '';
    fixture.detectChanges();
    expect(component.caption).toBe('tr:alpha.buttons.add');
  });

  it('should apply small class when sm is true', () => {
    component.sm = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.classList).toContain('p-button-sm');
  });

  it('should set disabled attribute when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should emit clicked when button clicked', () => {
    spyOn(component.clicked, 'emit');
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click', null);

    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
