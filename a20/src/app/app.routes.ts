import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'alpha-prime'
  },
  {
    path: 'alpha-prime',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./alpha-prime-demo/index.component')
            .then(m => m.AlphaPrimeIndexComponent)
      },
      {
        path: 'add-button',
        loadComponent: () =>
          import('./alpha-prime-demo/add-button.component')
            .then(m => m.AlphaPrimeAddButtonDemoComponent)
      },
      {
        path: 'auto-complete',
        loadComponent: () =>
          import('./alpha-prime-demo/auto-complete.component')
            .then(m => m.AlphaPrimeAutoCompleteDemoComponent)
      },
      {
        path: 'cancel-button',
        loadComponent: () =>
          import('./alpha-prime-demo/cancel-button.component')
            .then(m => m.AlphaPrimeAddButtonDemoComponent)
      },
      {
        path: 'confirmation-modal',
        loadComponent: () =>
          import('./alpha-prime-demo/confirmation-modal.component')
            .then(m => m.ConfirmationModalComponent)
      },
      {
        path: 'currency-input',
        loadComponent: () =>
          import('./alpha-prime-demo/currency-input.component')
            .then(m => m.CurrencyInputComponent)
      },
      {
        path: 'date-picker',
        loadComponent: () =>
          import('./alpha-prime-demo/date-picker.component')
            .then(m => m.DatePickerComponent)
      },
      {
        path: 'date-range-picker',
        loadComponent: () =>
          import('./alpha-prime-demo/date-range-picker.component')
            .then(m => m.DateRangePickerComponent)
      },
      {
        path: 'delete-button',
        loadComponent: () =>
          import('./alpha-prime-demo/delete-button.component')
            .then(m => m.DeleteButtonComponent)
      },
      {
        path: 'edit-button',
        loadComponent: () =>
          import('./alpha-prime-demo/edit-button.component')
            .then(m => m.EditButtonComponent)
      },
      {
        path: 'file-upload',
        loadComponent: () =>
          import('./alpha-prime-demo/file-upload.component')
            .then(m => m.FileUploadComponent)
      },
      {
        path: 'filter-box',
        loadComponent: () =>
          import('./alpha-prime-demo/filter-box.component')
            .then(m => m.FilterBoxComponent)
      },
      {
        path: 'label',
        loadComponent: () =>
          import('./alpha-prime-demo/label.component')
            .then(m => m.LabelComponent)
      },
      {
        path: 'login-form',
        loadComponent: () =>
          import('./alpha-prime-demo/login-form.component')
            .then(m => m.LoginFormComponent)
      },
      {
        path: 'login-modal',
        loadComponent: () =>
          import('./alpha-prime-demo/login-modal.component')
            .then(m => m.LoginModalComponent)
      },
      {
        path: 'number-input',
        loadComponent: () =>
          import('./alpha-prime-demo/number-input.component')
            .then(m => m.NumberInputComponent)
      },
      {
        path: 'ok-button',
        loadComponent: () =>
          import('./alpha-prime-demo/ok-button.component')
            .then(m => m.OkButtonComponent)
      },
      {
        path: 'password-input',
        loadComponent: () =>
          import('./alpha-prime-demo/password-input.component')
            .then(m => m.PasswordInputComponent)
      },
      {
        path: 'progress-bar',
        loadComponent: () =>
          import('./alpha-prime-demo/progress-bar.component')
            .then(m => m.ProgressBarComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'alpha-prime'
  }
];
