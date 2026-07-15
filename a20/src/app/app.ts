import {Component, signal, ChangeDetectionStrategy, inject, OnInit, Type} from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AlphaPrimeModalService, IAlphaPrimeModalConfig} from 'AlphaPrime';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService]
})
export class App implements OnInit {
  private mDs = inject(DialogService);
  private mMs = inject(AlphaPrimeModalService);

  protected readonly title = signal('a20');

  ngOnInit() {

    const dsOpen: (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
      (c, ddc) => {
        this.mDs.open(c, ddc);
      }

    this.mMs.init(dsOpen);
  }
}
