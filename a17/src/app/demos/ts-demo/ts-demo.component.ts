import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlphaTsService} from "../../../../projects/alpha-ts/src/lib/alpha-ts.service";
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Component({
  selector: 'app-ts-demo',
  standalone: true,
  imports: [],
  templateUrl: './ts-demo.component.html',
  styleUrl: './ts-demo.component.scss'
})
export class TsDemoComponent implements OnInit, OnDestroy {

  private sub = -1;

  titleLit: string | undefined;
  private setLiterals() {
    this.titleLit = this.mTs.getTr('demoTs.title');
  }

  constructor(
    private mTs: AlphaTsService,
    private mLbs: AlphaLbsService) {
    this.setLiterals();
  }

  ngOnInit(): void {
      this.sub = this.mLbs.subscribe(
        (lc: string) => {
          this.mTs.changeLanguageCode(lc);
          this.setLiterals();
          },
        'LANGUAGE_CODE_UPDATED');
  }

  ngOnDestroy() {
    this.mLbs.unsubscribe(this.sub);
  }

  onLanguageChanged(languageCode: string): void {
    this.mLbs.publish(languageCode, 'LANGUAGE_CODE_UPDATED');
  }

}
