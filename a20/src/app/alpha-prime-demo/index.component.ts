import {Component, ChangeDetectionStrategy, signal, Type, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';
import {IAlphaPrimeModalConfig} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal-abstractions';
import {AlphaPrimeService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime.service';
import {AlphaLbsService} from '../../../projects/alpha-lbs/src/lib/alpha-lbs.service';
import {of} from 'rxjs';
import {FakeOasService} from './fake-oas-service';

@Component({
  selector: 'app-alpha-prime-index',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime Components</h2>
      <ul>
        <li><a [routerLink]="['/alpha-prime', 'add-button']">AddButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'auto-complete']">AutoComplete</a></li>
        <li><a [routerLink]="['/alpha-prime', 'cancel-button']">CancelButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'confirmation-modal']">ConfirmationModal</a></li>
        <li><a [routerLink]="['/alpha-prime', 'currency-input']">CurrencyInput</a></li>
        <li><a [routerLink]="['/alpha-prime', 'date-picker']">DatePicker</a></li>
        <li><a [routerLink]="['/alpha-prime', 'date-range-picker']">DateRangePicker</a></li>
        <li><a [routerLink]="['/alpha-prime', 'delete-button']">DeleteButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'edit-button']">EditButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'file-upload']">FileUpload</a></li>
        <li><a [routerLink]="['/alpha-prime', 'filter-box']">FilterBox</a></li>
        <li><a [routerLink]="['/alpha-prime', 'label']">Label</a></li>
        <li><a [routerLink]="['/alpha-prime', 'login-form']">LoginForm</a></li>
        <li><a [routerLink]="['/alpha-prime', 'login-modal']">LoginModal</a></li>
        <li><a [routerLink]="['/alpha-prime', 'number-input']">NumberInput</a></li>
        <li><a [routerLink]="['/alpha-prime', 'ok-button']">OkButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'password-input']">PasswordInput</a></li>
        <li><a [routerLink]="['/alpha-prime', 'progress-bar']">ProgressBar</a></li>
        <li><a [routerLink]="['/alpha-prime', 'save-button']">SaveButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'scroller']">Scroller</a></li>
        <li><a [routerLink]="['/alpha-prime', 'select']">Select</a></li>
        <li><a [routerLink]="['/alpha-prime', 'submit-button']">SubmitButton</a></li>
      </ul>
    </section>
  `,
  imports: [RouterModule],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeIndexComponent implements OnInit {

  protected readonly title = signal('Alpha Prime');

  constructor(
    private mDs: DialogService,
    private mLbs: AlphaLbsService,
    private mMs: AlphaPrimeModalService,
    private mPs: AlphaPrimeService,
    private mOas: FakeOasService) {
  }

  ngOnInit() {

    console.log('initializing AlphaPrimeIndexComponent');

    // ModalService
    const dsOpen:
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) =>
        this.mDs.open(component, ddc);
    this.mMs.init(dsOpen);

    // TranslationService
    const ts = {
      getTr: (key: string, params?: any) => {
        let str = `getTr('${key}`;
        if (params) {
          str += `,${JSON.stringify(params)}`;
        }
        str += `')`;
        return str;
      }
    };

    // LoggerService
    const ls = {
      postNavigationLog: (path: string, title: string) => {
        console.log(`Navigated to ${path} with title ${title}`);
      }
    };

    // UploadService
    const us = {
      upload: (data: any, notifyProgress: (value: number) => any) => {
        console.log(`Uploading ${data.length} bytes`);
        notifyProgress(100);
        return of('uploadId');
      },
      deleteUpload: (uploadId: string) => {
        console.log(`Deleting upload with id: ${uploadId}`);
        return of(true);
      }
    };

    // OAuthService
    const oas = {
      signIn: (username: string, password: string, rememberMe: boolean) => {
        console.log(`OAuthService.signIn called with username: ${username}, rememberMe: ${rememberMe}`);
        return this.mOas.signIn(username, password, rememberMe); // Simulate successful sign-in
      }
    };

    // LocalBusService
    const lbs = {
      publish: (payload: any, channel: string): number => {
        console.log(`Published to LBS with payload: ${payload}, channel: ${channel}`);
        this.mLbs.publish(payload, channel);
        return 0;
      },
      subscribe: (callback: (payload: any) => number) => {
        console.log(`Subscribed to LBS with callback: ${callback}`);
        return this.mLbs.subscribe(callback);
      },
      unsubscribe: (subId: number) => {
        console.log(`Unsubscribed from LBS with subscription ID: ${subId}`);
        this.mLbs.unsubscribe(subId);
      }
    };

    // uses mOas (fake class) so that we can test whether
    // the singIn method should succeed
    this.mPs.init(false, ts, ls, oas, us, lbs);

    this.mPs.signIn('testUser', 'password', true)
      .subscribe({
        next: (success) => {
          console.log('Sign in via mPs success:', success);
        },
        error: (err) => {
          console.error('Sign in error:', err);
        }
      });

    console.log('AlphaPrimeIndexComponent initialized');

  }


}
