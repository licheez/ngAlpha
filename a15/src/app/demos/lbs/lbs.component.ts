import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlphaLbsService} from "@pvway/alpha-lbs";

@Component({
  selector: 'app-lbs',
  templateUrl: './lbs.component.html',
  styleUrls: ['./lbs.component.scss']
})
export class LbsComponent implements OnInit, OnDestroy {

  /**
   * payload : { hours: number, minutes: number, seconds: number }
   */
  static readonly CLOCK_CHANNEL = 'LbsComponent.clock_channel';

  clock: {hours: number, minutes: number, seconds: number};

  private sub = -1;

  constructor(
    private mLbs: AlphaLbsService) {
    const now = new Date();
    this.clock = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds()
    };
  }

  ngOnInit() {
    this.sub = this.mLbs.subscribe(
      (clock:  {hours: number, minutes: number, seconds: number}) =>
        this.clock = clock,
      LbsComponent.CLOCK_CHANNEL);

    setInterval(
      () => {
        const now = new Date();
        this.mLbs.publish({
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds()},
          LbsComponent.CLOCK_CHANNEL);
      }, 800);
  }

  ngOnDestroy() {
    this.mLbs.unsubscribe(this.sub);
  }

}
