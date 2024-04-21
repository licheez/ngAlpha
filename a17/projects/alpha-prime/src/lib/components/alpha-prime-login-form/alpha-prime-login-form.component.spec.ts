import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeLoginFormComponent } from './alpha-prime-login-form.component';
import {EventEmitter} from "@angular/core";
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {Observable, of, Subscriber} from "rxjs";
import {jest} from "@jest/globals";

describe('AlphaPrimeLoginFormComponent', () => {
  let component: AlphaPrimeLoginFormComponent;
  let fixture: ComponentFixture<AlphaPrimeLoginFormComponent>;

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [
        AlphaPrimeLoginFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(()=>{
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showCancelButton).toBeFalsy();
    expect(component.fm).toBeDefined();
    expect(component.busy).toBeFalsy();
    expect(component.errorMessage).toBeUndefined();
    expect(component.loggedIn).toBeInstanceOf(EventEmitter);
    expect(component.cancelled).toBeInstanceOf(EventEmitter);
  });

  it('should initialize literals',() => {
    const alphaPrimeService = {
      getTr: (key: string) => key
    } as any as AlphaPrimeService
    const component = new AlphaPrimeLoginFormComponent(
      alphaPrimeService);
    expect(component.usernameLit).toEqual('alpha.common.username');
    expect(component.passwordLit).toEqual('alpha.common.password');
    expect(component.failureLit).toEqual('alpha.common.failure');
    expect(component.invalidCredentialsLit).toEqual('alpha.common.invalidCredentials');
    expect(component.connectLabelLit).toEqual('alpha.loginForm.connect');
  });

  it('should handle onCancel', () => {
    const spy = jest.spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  describe('handle onSubmit', () => {

    it('should singIn with success', () => {

      const alphaPrimeService = {
        oas: {
          signIn: () =>
            new Observable<boolean>(
              (subscriber: Subscriber<boolean>) => {
                setTimeout(() => subscriber.next(true),
                  10);
              })
        },
        getTr: (key: string) => key
      } as any as AlphaPrimeService
      const component = new AlphaPrimeLoginFormComponent(
        alphaPrimeService);
      const spy = jest.spyOn(component.loggedIn, 'emit');

      component.errorMessage = 'someMessage';
      component.onSubmit();
      expect(component.busy).toBeTruthy();
      expect(component.errorMessage).toBeUndefined();
      jest.advanceTimersByTime(10);
      expect(spy).toHaveBeenCalled();
      expect(component.busy).toBeFalsy();
    });

    it('sign in should handle invalid creds', () => {

      const alphaPrimeService = {
        oas: {
          signIn: () =>
            new Observable<boolean>(
              (subscriber: Subscriber<boolean>) => {
                setTimeout(() => subscriber.next(false),
                  10);
              })
        },
        getTr: (key: string) => key
      } as any as AlphaPrimeService

      const component = new AlphaPrimeLoginFormComponent(
        alphaPrimeService);
      const spy = jest.spyOn(component.loggedIn, 'emit');

      component.errorMessage = 'someMessage';
      component.onSubmit();
      expect(component.busy).toBeTruthy();
      expect(component.errorMessage).toBeUndefined();
      jest.advanceTimersByTime(10);
      expect(spy).not.toHaveBeenCalled();
      expect(component.errorMessage).toEqual(component.invalidCredentialsLit);
      expect(component.busy).toBeFalsy();
    });

    it('sign in should fail', () => {

      const alphaPrimeService = {
        oas: {
          signIn: () =>
            new Observable<boolean>(
              (subscriber: Subscriber<boolean>) => {
                setTimeout(() => subscriber.error('someError'),
                  10);
              })
        },
        getTr: (key: string) => key
      } as any as AlphaPrimeService

      const component = new AlphaPrimeLoginFormComponent(
        alphaPrimeService);
      const spy = jest.spyOn(component.loggedIn, 'emit');

      component.errorMessage = 'someMessage';
      component.onSubmit();
      expect(component.busy).toBeTruthy();
      expect(component.errorMessage).toBeUndefined();
      jest.advanceTimersByTime(10);
      expect(spy).not.toHaveBeenCalled();
      expect(component.errorMessage).toEqual(component.failureLit);
      expect(component.busy).toBeFalsy();
    });

  });

});
