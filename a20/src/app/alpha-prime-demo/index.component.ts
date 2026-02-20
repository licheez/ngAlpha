import {Component, ChangeDetectionStrategy, signal, Type} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';
import {IAlphaPrimeModalConfig} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal-abstractions';
import {AlphaPrimeService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime.service';
import {of} from 'rxjs';

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
        <li><a [routerLink]="['/alpha-prime', 'progress-bar']">ProgressBar</a></li>
      </ul>
    </section>
  `,
  imports: [RouterModule],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeIndexComponent {
  protected readonly title = signal('Alpha Prime');

  constructor(
    ds: DialogService,
    private mMs: AlphaPrimeModalService,
    private mPs: AlphaPrimeService) {
    const dsOpen:
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) =>
        ds.open(component, ddc);
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

    // OAuthService
    const oas = {
      signIn: (username: string, password: string, rememberMe: boolean) => {
        console.log(`Signing in with username: ${username}, rememberMe: ${rememberMe}`);
        return of(true);
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

    this.mPs.init(false, ts, ls, oas, us);
  }
}
