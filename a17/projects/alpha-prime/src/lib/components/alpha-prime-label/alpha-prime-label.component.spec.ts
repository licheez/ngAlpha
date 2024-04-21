import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AlphaPrimeLabelComponent} from './alpha-prime-label.component';
import {AlphaPrimeService} from "../../services/alpha-prime.service";

describe('AlphaPrimeLabelComponent', () => {

  let component: AlphaPrimeLabelComponent;
  let alphaPrimeService: Partial<AlphaPrimeService>;
  let fixture: ComponentFixture<AlphaPrimeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLabelComponent],
      providers: [AlphaPrimeService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLabelComponent);
    alphaPrimeService = TestBed.inject(AlphaPrimeService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.caption).toEqual('');
    expect(component.value).toEqual('dummy');
    expect(component.invalid).toBeFalsy();

    expect(component.empty).toBeFalsy();
    expect(component.showMessage).toBeFalsy();
  });

  it('should subscribe to the showMessage trigger', () => {
    alphaPrimeService.lbs!.subscribe =
      (callback: (payload: any) => any, channel: string) => {
        expect(channel).toEqual(AlphaPrimeLabelComponent.SHOW_MESSAGE);
        callback(true);
        return 1;
      };
    expect(component.showMessage).toBeFalsy();
    component.ngOnInit();
    expect(component.showMessageSub).toEqual(1);
    expect(component.showMessage).toBeTruthy();
  });

});
