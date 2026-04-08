import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-explore-index',
  imports: [RouterModule],
  template: `
    <section>
      <h2>Explore</h2>
      <ul>
        <li><a [routerLink]="['/explore', 'overlay-demo']">OverlayDemo</a></li>
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExploreIndexComponent {}

