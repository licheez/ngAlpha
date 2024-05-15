import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlphaPrimeCancelButtonComponent } from './alpha-prime-cancel-button.component';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

describe('AlphaPrimeCancelButtonComponent', () => {
  let component: AlphaPrimeCancelButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeCancelButtonComponent>;
  let service: AlphaPrimeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, TooltipModule],
      providers: [AlphaPrimeService]
    })
      .compileComponents();
    service = TestBed.inject(AlphaPrimeService);
    fixture = TestBed.createComponent(AlphaPrimeCancelButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on onClicked call', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    component.onClicked();
    expect(spy).toHaveBeenCalled();
  });

  it('should correctly initialize the value of caption', () => {
    expect(component.caption)
      .toEqual(service.getTr('alpha.buttons.cancel'));
  });

  it('should correctly initialize the value of sm', () => {
    expect(component.sm).toBe(false);
  });

  it('should correctly initialize the value of disabled as false', () => {
    expect(component.disabled).toBe(false);
  });
});
