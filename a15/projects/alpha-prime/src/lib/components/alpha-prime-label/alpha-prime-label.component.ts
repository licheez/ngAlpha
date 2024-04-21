import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-label',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './alpha-prime-label.component.html',
  styleUrls: ['./alpha-prime-label.component.css']
})
export class AlphaPrimeLabelComponent implements OnInit, OnDestroy {

  /** payload => show: boolean  */
  static readonly SHOW_MESSAGE = `AlphaPrimeLabelComponent.ShowMessage`;

  @Input() caption = '';
  @Input() value: string | undefined = 'dummy';
  @Input() invalid = false;

  get empty(): boolean {
    return (!this.value || this.value.trim() === '')
  }

  showMessage = false;

  constructor(
    private mPs: AlphaPrimeService) {
  }

  requiredOrInvalidLit = this.mPs.getTr('alpha.label.requiredOrInvalid');

  showMessageSub = -1;

  ngOnInit(): void {
    this.showMessageSub = this.mPs.lbs.subscribe(
      (show: boolean) => this.showMessage = show,
      AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

  ngOnDestroy(): void {
    this.mPs.lbs.unSubscribe(this.showMessageSub);
  }

}
