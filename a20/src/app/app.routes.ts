import { Routes } from '@angular/router';

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
        loadComponent: () => import('./alpha-prime-demo/index.component').then(m => m.AlphaPrimeIndexComponent)
      },
      {
        path: 'add-button',
        loadComponent: () => import('./alpha-prime-demo/add-button.component').then(m => m.AlphaPrimeAddButtonDemoComponent)
      },
      {
        path: 'auto-complete',
        loadComponent: () => import('./alpha-prime-demo/auto-complete.component').then(m => m.AlphaPrimeAutoCompleteDemoComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'alpha-prime'
  }
];
