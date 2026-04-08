import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  template: `
    <section>
      <h1>A20 - Demo App</h1>
      <ul>
        <li><a [routerLink]="['/alpha-prime']">Alpha Prime Components</a></li>
        <li><a [routerLink]="['/explore']">Explore</a></li>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}

