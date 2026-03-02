import { Injectable } from '@angular/core';
import {Observable, Observer} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakeOasService {
  success: boolean = true;
  throwError: boolean = false;

  signIn(username: string, password: string, rememberMe: boolean): Observable<boolean> {

    console.log(`Signing in with username: ${username}, password: ${'*'.repeat(password.length)}, rememberMe: ${rememberMe} - returning ${this.success}`);

    return new Observable<boolean>((observer: Observer<boolean>) => {
      // Simulate 3-second network delay
      setTimeout(() => {
        if (this.throwError) {
          console.log('Simulating error response');
          observer.error(new Error('Simulated sign-in failure'));
        } else {
          console.log('Simulating successful response');
          observer.next(this.success);
          observer.complete();
        }
      }, 3000);
    });
  }
}
