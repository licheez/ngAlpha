import {Component, Input, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'alpha-prime-debug-tag',
  imports: [
    Tooltip
  ],
  templateUrl: './alpha-prime-debug-tag.component.html',
  styleUrls: ['./alpha-prime-debug-tag.component.css']
})
export class AlphaPrimeDebugTagComponent {
  visible = false;

  // Internal signal for reactive usage inside the component
  tagSignal = signal<string>('');

  // Build-time enforcement: expose a traditional string input (`tag`) marked required
  // so Angular's template type-checker enforces the presence of the input when the
  // component is used in templates. The setter updates the internal signal.
  @Input({ required: true })
  set tag(value: string) {
    this.tagSignal.set(value);
  }
  get tag(): string {
    return this.tagSignal();
  }

  constructor(private mPs: AlphaPrimeService) { }

  ngOnInit(): void {
    if (this.mPs.isProduction) {
      localStorage.setItem('alphaHideDebugTag', 'true');
    }
    const hide = localStorage.getItem('alphaHideDebugTag');
    this.visible = hide == null || hide == 'false';
  }

  static hide(hidden: boolean): void {
    if (hidden) {
      localStorage.setItem('alphaHideDebugTag', 'true');
    } else {
      localStorage.removeItem('alphaHideDebugTag');
    }
    window.location.reload();
  }

  static get hidden(): boolean {
    const hide = localStorage.getItem('alphaHideDebugTag');
    return hide == 'true';
  }
}
